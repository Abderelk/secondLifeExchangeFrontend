import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  AddPhotoAlternate,
  Close,
} from '@mui/icons-material';
import { createItem } from '../services/itemService';

const categories = [
  { value: 'vêtements', label: '👕 Vêtements' },
  { value: 'électronique', label: '📱 Électronique' },
  { value: 'livres', label: '📚 Livres' },
  { value: 'meubles', label: '🪑 Meubles' },
  { value: 'décoration', label: '🖼️ Décoration' },
  { value: 'jouets', label: '🧸 Jouets' },
  { value: 'sport', label: '⚽ Sport' },
  { value: 'outils', label: '🔧 Outils' },
  { value: 'cuisine', label: '🍳 Cuisine' },
  { value: 'jardin', label: '🌱 Jardin' },
  { value: 'multimédia', label: '🎮 Multimédia' },
  { value: 'autre', label: '📦 Autre' },
];

const conditions = [
  { value: 'neuf', label: '✨ Neuf - Jamais utilisé' },
  { value: 'très bon', label: '👍 Très bon - Quasi neuf' },
  { value: 'bon', label: '👌 Bon - Quelques traces d\'usure' },
  { value: 'correct', label: '🤏 Correct - Usure visible' },
  { value: 'usé', label: '👎 Usé - À rénover' },
];

export const AddItemPage = () => {
  const navigate = useNavigate();
  
  type Condition = 'neuf' | 'très bon' | 'bon' | 'correct' | 'usé';

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    condition: Condition | '';
    city: string;
    postalCode: string;
  }>({
    title: '',
    description: '',
    category: '',
    condition: '',
    city: '',
    postalCode: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageUrl && images.length < 5) {
      setImages(prev => [...prev, imageUrl]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.city || !formData.postalCode) {
      setError('Veuillez indiquer votre localisation');
      return;
    }

    // Double check condition is valid
    if (!['neuf', 'très bon', 'bon', 'correct', 'usé'].includes(formData.condition)) {
      setError('Veuillez sélectionner un état valide');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition as Condition,
        images: images.length > 0 ? images : ['https://via.placeholder.com/400?text=No+Image'],
        location: {
          city: formData.city,
          postalCode: formData.postalCode,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: 48 }}>🎉</Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Objet ajouté avec succès !
          </Typography>
          <Typography color="text.secondary">
            Votre objet est maintenant visible par la communauté.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700} color="#1F2937">
            Proposer un objet
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Images */}
          <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
            <Typography fontWeight={600} color="#1F2937" gutterBottom>
              Photos (max 5)
            </Typography>
            
            {/* Images preview */}
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
                    onClick={() => handleRemoveImage(index)}
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

            {/* Add image URL */}
            {images.length < 5 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="URL de l'image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddImage}
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

          {/* Informations */}
          <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
            <Typography fontWeight={600} color="#1F2937" gutterBottom>
              Informations
            </Typography>

            <TextField
              fullWidth
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              placeholder="Ex: Pull en laine bleu"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              placeholder="Décrivez votre objet (état, taille, particularités...)"
            />

            <TextField
              fullWidth
              select
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="État"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              {conditions.map((cond) => (
                <MenuItem key={cond.value} value={cond.value}>
                  {cond.label}
                </MenuItem>
              ))}
            </TextField>
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
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                placeholder="Paris"
              />
              <TextField
                label="Code postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                placeholder="75011"
              />
            </Box>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#22C55E',
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#16A34A' },
              '&:disabled': { backgroundColor: '#86EFAC' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              'Publier mon objet'
            )}
          </Button>
        </form>
      </Container>

    </Box>
  );
};

export default AddItemPage;