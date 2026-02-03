// src/pages/EditProfilePage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Card,
    Avatar,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import { ArrowBack, CameraAlt } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
        city: '',
        postalCode: '',
        avatar: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                bio: user.bio || '',
                city: user.city || '',
                postalCode: user.postalCode || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName) {
            setError('Le prénom et le nom sont requis');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await api.put('/auth/profile', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                address: {
                    city: formData.city,
                    postalCode: formData.postalCode,
                },
                avatar: formData.avatar,
            });

            // Mettre à jour le contexte
            if (updateUser && response.data.data) {
                updateUser(response.data.data);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        return `${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Container maxWidth="sm" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" fontWeight={700} color="#1F2937">
                        Modifier mon profil
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Profil mis à jour avec succès !
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Avatar */}
                    <Card sx={{ p: 3, borderRadius: '16px', mb: 3, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={formData.avatar}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    fontSize: 36,
                                    backgroundColor: '#22C55E',
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    '&:hover': { backgroundColor: '#F3F4F6' },
                                }}
                                size="small"
                            >
                                <CameraAlt sx={{ fontSize: 18, color: '#6B7280' }} />
                            </IconButton>
                        </Box>

                        <TextField
                            fullWidth
                            size="small"
                            placeholder="URL de votre photo de profil"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                    </Card>

                    {/* Informations personnelles */}
                    <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Typography fontWeight={600} color="#1F2937" gutterBottom>
                            Informations personnelles
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Prénom"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Nom"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            disabled
                            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            helperText="L'email ne peut pas être modifié"
                        />

                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            placeholder="Parlez-nous de vous..."
                            inputProps={{ maxLength: 200 }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                            {formData.bio.length}/200
                        </Typography>
                    </Card>

                    {/* Localisation */}
                    <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Typography fontWeight={600} color="#1F2937" gutterBottom>
                            Localisation
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Ville"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                            <TextField
                                label="Code postal"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                            />
                        </Box>
                    </Card>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/profile')}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                borderColor: '#E5E7EB',
                                color: '#6B7280',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                backgroundColor: '#22C55E',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#16A34A' },
                                '&:disabled': { backgroundColor: '#86EFAC' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Enregistrer'}
                        </Button>
                    </Box>
                </form>
            </Container>

        </Box>
    );
};

export default EditProfilePage;