// src/components/auth/Register.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import {
  PasswordStrengthIndicator,
  isValidPassword,
  CityAutocomplete,
  PasswordInput,
  FormField,
  AuthTabs,
  TermsCheckbox,
} from './registerComponents';

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#F3F4F6',
    '& fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: '2px solid #22C55E' },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '14px',
    '&::placeholder': { color: '#9CA3AF', opacity: 1 },
  },
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    postalCode: '',
    country: 'France',
    password: '',
    confirmPassword: '',
    bio: '',
    interests: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityInputValue, setCityInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCitySelect = (city: string, postalCode: string) => {
    setFormData(prev => ({
      ...prev,
      city,
      postalCode: postalCode || prev.postalCode,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Le nom est requis');
      return;
    }
    if (!formData.email.trim()) {
      setError("L'email est requis");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Veuillez entrer une adresse email valide (ex: nom@exemple.com)');
      return;
    }
    if (!formData.city.trim()) {
      setError('La ville est requise');
      return;
    }
    if (!formData.postalCode.trim()) {
      setError('Le code postal est requis');
      return;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return;
    }
    if (!isValidPassword(formData.password)) {
      setError('Le mot de passe doit contenir au moins 12 caractères, une majuscule et un caractère spécial');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!acceptTerms) {
      setError("Vous devez accepter les conditions générales d'utilisation");
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: {
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country,
        },
        bio: formData.bio.trim(),
        interests: formData.interests,
      };

      await register(registerData);
      navigate('/home');
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || '';

      if (errorMessage.includes('email') && errorMessage.includes('invalide')) {
        setError('Veuillez entrer une adresse email valide (ex: nom@exemple.com)');
      } else if (errorMessage.includes('email') && errorMessage.includes('utilisé')) {
        setError('Cette adresse email est déjà utilisée. Essayez de vous connecter.');
      } else if (errorMessage.includes('mot de passe')) {
        setError('Le mot de passe ne respecte pas les critères de sécurité');
      } else if (errorMessage.includes('validation')) {
        setError('Veuillez vérifier les informations saisies');
      } else {
        setError(errorMessage || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 50%, #F0FDFA 100%)',
      }}
    >
      <img
        src="/logo.jpeg"
        alt="SecondLife Exchange"
        style={{
          width: '160px',
          height: 'auto',
          borderRadius: '16px',
          marginBottom: '32px',
        }}
      />

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <AuthTabs activeTab="register" />

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1F2937', margin: '0 0 4px 0' }}>
            Inscription
          </h2>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px 0' }}>
            Créez un compte pour rejoindre la communauté
          </p>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', '& .MuiAlert-message': { fontSize: '14px' } }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Prénom et Nom */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Prénom <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Jean"
                  size="small"
                  sx={inputStyles}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Nom <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Dupont"
                  size="small"
                  sx={inputStyles}
                />
              </div>
            </div>

            <FormField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="vous@exemple.com"
              loading={loading}
              inputStyles={inputStyles}
              autoComplete="email"
            />

            <FormField
              name="phone"
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              loading={loading}
              inputStyles={inputStyles}
            />

            {/* Ville et Code postal */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Ville <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <CityAutocomplete
                  cityInputValue={cityInputValue}
                  onCityInputChange={setCityInputValue}
                  onCitySelect={handleCitySelect}
                  loading={loading}
                  inputStyles={inputStyles}
                />
              </div>
              <div style={{ width: '120px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                  Code postal <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="75001"
                  size="small"
                  sx={inputStyles}
                />
              </div>
            </div>

            <PasswordInput
              name="password"
              label="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggleShow={() => setShowPassword(!showPassword)}
              placeholder="Créez un mot de passe sécurisé"
              loading={loading}
              inputStyles={inputStyles}
            />

            <PasswordStrengthIndicator password={formData.password} />

            <PasswordInput
              name="confirmPassword"
              label="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirmez votre mot de passe"
              loading={loading}
              inputStyles={inputStyles}
              error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
            />

            <FormField
              name="bio"
              label="Bio (optionnel)"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Parlez-nous de vous et de vos centres d'intérêt..."
              loading={loading}
              inputStyles={inputStyles}
              multiline
              rows={3}
            />

            <TermsCheckbox
              checked={acceptTerms}
              onChange={setAcceptTerms}
              loading={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#22C55E',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 600,
                padding: '12px',
                borderRadius: '10px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#16A34A', boxShadow: 'none' },
                '&:disabled': { backgroundColor: '#86EFAC' },
              }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
