// src/components/auth/Register.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Stepper,
  Step,
  StepLabel,
  OutlinedInput,
  type SelectChangeEvent
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { INTEREST_CATEGORIES } from '../../types';

const steps = ['Informations', 'Localisation', 'Préférences'];

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    interests: [] as string[],
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleInterestsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      interests: typeof value === 'string' ? value.split(',') : value
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        return true;
      case 1:
        if (!formData.address.city || !formData.address.postalCode) {
          setError('La ville et le code postal sont requis');
          return false;
        }
        return true;
      case 2:
        if (formData.interests.length === 0) {
          setError('Veuillez sélectionner au moins une catégorie');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);

    try {
      const {  ...credentials } = formData;
      await register(credentials);
      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              <TextField
                fullWidth
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </div>

            <TextField
              fullWidth
              label="Adresse email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Téléphone (optionnel)"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              placeholder="+33 6 12 34 56 78"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <TextField
              fullWidth
              label="Adresse (optionnel)"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Ville"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                fullWidth
                label="Code postal"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </div>

            <TextField
              fullWidth
              label="Pays"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
              <p className="text-emerald-900 font-medium mb-2">🎯 Personnalisez votre expérience</p>
              <p className="text-emerald-700 text-sm">
                Sélectionnez vos catégories préférées pour des recommandations sur mesure
              </p>
            </div>

            <FormControl fullWidth>
              <InputLabel>Centres d'intérêt</InputLabel>
              <Select
                multiple
                value={formData.interests}
                onChange={handleInterestsChange}
                input={<OutlinedInput label="Centres d'intérêt" />}
                sx={{ borderRadius: '12px' }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selected.map((value) => {
                      const category = INTEREST_CATEGORIES.find(c => c.value === value);
                      return (
                        <Chip 
                          key={value} 
                          label={`${category?.icon} ${category?.label.split(' ')[1]}`}
                          size="small"
                          className="bg-emerald-100 text-emerald-800"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {INTEREST_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <span className="mr-3 text-xl">{category.icon}</span>
                    <span>{category.label.split(' ')[1]}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Bio (optionnel)"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              disabled={loading}
              placeholder="Parlez-nous de votre engagement..."
              helperText={`${formData.bio.length}/500 caractères`}
              inputProps={{ maxLength: 500 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-emerald-50/30 to-white p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-3xl mb-6">
            <span className="text-5xl">🌿</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Rejoignez SecondLife
          </h1>
          <p className="text-gray-600 text-lg">
            Créez votre compte en quelques minutes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          <Stepper activeStep={activeStep} className="mb-10">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" className="mb-6" style={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box className="mb-8">
              {renderStepContent(activeStep)}
            </Box>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                startIcon={<ArrowBack />}
                className="px-6 py-3"
                style={{ 
                  borderRadius: '12px',
                  textTransform: 'none'
                }}
              >
                Retour
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={loading}
                  className="px-8 py-3 font-semibold shadow-lg"
                  style={{ 
                    backgroundColor: loading ? undefined : '#059669',
                    borderRadius: '12px',
                    textTransform: 'none'
                  }}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                  className="px-8 py-3 font-semibold shadow-lg"
                  style={{ 
                    backgroundColor: '#059669',
                    borderRadius: '12px',
                    textTransform: 'none'
                  }}
                  endIcon={<ArrowForward />}
                >
                  Continuer
                </Button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Typography variant="body2" className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Se connecter
              </Link>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};