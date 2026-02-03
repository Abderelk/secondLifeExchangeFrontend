// src/components/ImagePicker/ImagePicker.tsx

import React, { useRef, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Typography,
    CircularProgress,
    Dialog,
    DialogContent,
    Stack,
    Alert,
} from '@mui/material';
import {
    CameraAlt,
    PhotoLibrary,
    Close,
    AddAPhoto,
    Delete,
} from '@mui/icons-material';
import { uploadService } from '../../services/uploadService';

interface ImagePickerProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
    images,
    onChange,
    maxImages = 5,
    disabled = false,
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Ouvrir la caméra
    const handleCameraClick = () => {
        setShowOptions(false);
        cameraInputRef.current?.click();
    };

    // Ouvrir la galerie
    const handleGalleryClick = () => {
        setShowOptions(false);
        galleryInputRef.current?.click();
    };

    // Gérer la sélection de fichiers
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // Vérifier le nombre max d'images
        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            setError(`Maximum ${maxImages} images autorisées`);
            return;
        }

        // Limiter aux slots disponibles
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        setIsUploading(true);
        setError(null);

        try {
            // Upload des images
            const uploadedUrls = await uploadService.uploadImages(filesToUpload);

            // Ajouter les nouvelles URLs
            onChange([...images, ...uploadedUrls]);
        } catch (err) {
            console.error('Erreur upload:', err);
            setError('Erreur lors de l\'upload des images. Réessayez.');
        } finally {
            setIsUploading(false);
            // Reset les inputs pour permettre de re-sélectionner le même fichier
            if (cameraInputRef.current) cameraInputRef.current.value = '';
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    // Supprimer une image
    const handleRemoveImage = async (index: number) => {
        const imageUrl = images[index];

        try {
            // Supprimer du serveur (optionnel, peut être fait en background)
            await uploadService.deleteImage(imageUrl);
        } catch (err) {
            console.error('Erreur suppression:', err);
            // On continue quand même à supprimer localement
        }

        // Supprimer localement
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const canAddMore = images.length < maxImages && !disabled;

    return (
        <Box>
            {/* Message d'erreur */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Grille d'images */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.5,
                    mb: 2,
                }}
            >
                {/* Images existantes */}
                {images.map((url, index) => (
                    <Box
                        key={url}
                        sx={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: 'grey.100',
                        }}
                    >
                        <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        {!disabled && (
                            <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                                }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        )}
                        {index === 0 && (
                            <Typography
                                variant="caption"
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    left: 4,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    fontSize: '0.65rem',
                                }}
                            >
                                Photo principale
                            </Typography>
                        )}
                    </Box>
                ))}

                {/* Bouton ajouter */}
                {canAddMore && (
                    <Box
                        onClick={() => !isUploading && setShowOptions(true)}
                        sx={{
                            aspectRatio: '1',
                            borderRadius: 2,
                            border: '2px dashed',
                            borderColor: 'grey.300',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isUploading ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: isUploading ? 'grey.300' : 'primary.main',
                                bgcolor: isUploading ? 'transparent' : 'primary.50',
                            },
                        }}
                    >
                        {isUploading ? (
                            <CircularProgress size={32} />
                        ) : (
                            <>
                                <AddAPhoto sx={{ fontSize: 32, color: 'grey.400', mb: 0.5 }} />
                                <Typography variant="caption" color="text.secondary">
                                    Ajouter
                                </Typography>
                            </>
                        )}
                    </Box>
                )}
            </Box>

            {/* Compteur */}
            <Typography variant="caption" color="text.secondary">
                {images.length}/{maxImages} photos
            </Typography>

            {/* Inputs cachés */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Dialog de sélection */}
            <Dialog
                open={showOptions}
                onClose={() => setShowOptions(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxWidth: 300,
                        width: '90%',
                    },
                }}
            >
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Ajouter une photo</Typography>
                        <IconButton size="small" onClick={() => setShowOptions(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Stack spacing={1.5}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<CameraAlt />}
                            onClick={handleCameraClick}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                justifyContent: 'flex-start',
                                px: 3,
                            }}
                        >
                            Prendre une photo
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<PhotoLibrary />}
                            onClick={handleGalleryClick}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                justifyContent: 'flex-start',
                                px: 3,
                            }}
                        >
                            Choisir dans la galerie
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ImagePicker;