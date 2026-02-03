import { Box, Card, Typography, TextField, Button, IconButton } from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';

interface ImageUploadSectionProps {
  images: string[];
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

export const ImageUploadSection = ({
  images,
  imageUrl,
  onImageUrlChange,
  onAddImage,
  onRemoveImage,
}: ImageUploadSectionProps) => (
  <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
    <Typography fontWeight={600} color="#1F2937" gutterBottom>
      Photos (max 5)
    </Typography>

    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
      {images.map((img, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            width: 80,
            height: 80,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <img
            src={img}
            alt={`Photo ${index + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <IconButton
            size="small"
            onClick={() => onRemoveImage(index)}
            sx={{
              position: 'absolute',
              top: 2,
              right: 2,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              padding: '2px',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ))}
    </Box>

    {images.length < 5 && (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="URL de l'image"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
        <Button
          variant="outlined"
          onClick={onAddImage}
          disabled={!imageUrl}
          sx={{
            borderColor: '#22C55E',
            color: '#22C55E',
            minWidth: 'auto',
            px: 2,
            '&:hover': { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
          }}
        >
          <AddPhotoAlternate />
        </Button>
      </Box>
    )}
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
      Collez des URLs d'images (Unsplash, Imgur, etc.)
    </Typography>
  </Card>
);

export default ImageUploadSection;
