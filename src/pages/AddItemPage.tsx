import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Alert, CircularProgress } from '@mui/material';
import { createItem } from '../services/itemService';
import {
  ImageUploadSection,
  ItemFormFields,
  LocationInput,
  SuccessScreen,
  PageHeader,
} from '../components/addItem';

type Condition = 'neuf' | 'très bon' | 'bon' | 'correct' | 'usé';

interface FormData {
  title: string;
  description: string;
  category: string;
  condition: Condition | '';
  city: string;
  postalCode: string;
}

export const AddItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
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

    if (!formData.title || !formData.description || !formData.category || !formData.condition) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.city || !formData.postalCode) {
      setError('Veuillez indiquer votre localisation');
      return;
    }

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
    return <SuccessScreen />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 4 } }}>
        <PageHeader title="Proposer un objet" onBack={() => navigate(-1)} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <ImageUploadSection
            images={images}
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
          />

          <ItemFormFields
            title={formData.title}
            description={formData.description}
            category={formData.category}
            condition={formData.condition}
            onChange={handleChange}
          />

          <LocationInput
            city={formData.city}
            postalCode={formData.postalCode}
            onChange={handleChange}
          />

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
