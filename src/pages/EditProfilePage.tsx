// src/pages/EditProfilePage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PageHeader } from '../components/addItem';
import {
  AvatarSection,
  PersonalInfoForm,
  LocationForm,
  FormActions,
} from '../components/editProfile';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  city: string;
  postalCode: string;
  avatar: string;
}

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState<FormData>({
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
        <PageHeader title="Modifier mon profil" onBack={() => navigate(-1)} />

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
          <AvatarSection
            avatar={formData.avatar}
            initials={getInitials()}
            onAvatarChange={handleChange}
          />

          <PersonalInfoForm
            firstName={formData.firstName}
            lastName={formData.lastName}
            email={formData.email}
            bio={formData.bio}
            onChange={handleChange}
          />

          <LocationForm
            city={formData.city}
            postalCode={formData.postalCode}
            onChange={handleChange}
          />

          <FormActions loading={loading} onCancel={() => navigate('/profile')} />
        </form>
      </Container>
    </Box>
  );
};

export default EditProfilePage;
