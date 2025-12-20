// src/components/auth/Register.tsx

import { useState, useEffect, useCallback, type SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Check, Close } from '@mui/icons-material';

// Type pour les suggestions de ville
interface CitySuggestion {
  city: string;
  postalCode: string;
  label: string;
}

// Type pour la réponse de l'API adresse
interface AddressFeature {
  properties: {
    city?: string;
    name?: string;
    postcode: string;
  };
}

interface AddressApiResponse {
  features: AddressFeature[];
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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

  // État pour l'autocomplétion
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [cityInputValue, setCityInputValue] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);

  const debouncedCityInput = useDebounce(cityInputValue, 300);

  // Recherche de villes via l'API gouvernementale
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=10`
      );
      const data: AddressApiResponse = await response.json();

      const suggestions: CitySuggestion[] = data.features.map((feature: AddressFeature) => ({
        city: feature.properties.city || feature.properties.name || '',
        postalCode: feature.properties.postcode,
        label: `${feature.properties.city || feature.properties.name} (${feature.properties.postcode})`,
      }));

      // Supprimer les doublons
      const uniqueSuggestions = suggestions.filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.label === suggestion.label)
      );

      setCitySuggestions(uniqueSuggestions);
    } catch (err) {
      console.error('Erreur lors de la recherche de villes:', err);
      setCitySuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Effet pour la recherche de villes
  useEffect(() => {
    searchCities(debouncedCityInput);
  }, [debouncedCityInput, searchCities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Sélection d'une ville depuis l'autocomplétion
  const handleCitySelect = (
    _event: SyntheticEvent<Element, Event>,
    value: CitySuggestion | string | null
  ) => {
    if (value && typeof value !== 'string') {
      setSelectedCity(value);
      setFormData(prev => ({
        ...prev,
        city: value.city,
        postalCode: value.postalCode,
      }));
      setCityInputValue(value.city);
    } else if (typeof value === 'string') {
      setFormData(prev => ({
        ...prev,
        city: value,
      }));
    }
  };

  // Validation de l'email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation du mot de passe - critères individuels
  const passwordCriteria = {
    minLength: (password: string) => password.length >= 12,
    hasUppercase: (password: string) => /[A-Z]/.test(password),
    hasLowercase: (password: string) => /[a-z]/.test(password),
    hasNumber: (password: string) => /[0-9]/.test(password),
    hasSpecialChar: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (passwordCriteria.minLength(password)) strength += 20;
    if (passwordCriteria.hasUppercase(password)) strength += 20;
    if (passwordCriteria.hasLowercase(password)) strength += 20;
    if (passwordCriteria.hasNumber(password)) strength += 20;
    if (passwordCriteria.hasSpecialChar(password)) strength += 20;
    return strength;
  };

  const isValidPassword = (password: string): boolean => {
    return (
      passwordCriteria.minLength(password) &&
      passwordCriteria.hasUppercase(password) &&
      passwordCriteria.hasSpecialChar(password)
    );
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 20) return '#EF4444';
    if (strength <= 40) return '#F97316';
    if (strength <= 60) return '#EAB308';
    if (strength <= 80) return '#84CC16';
    return '#22C55E';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations côté frontend
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return;
    }

    if (!formData.lastName.trim()) {
      setError('Le nom est requis');
      return;
    }

    if (!formData.email.trim()) {
      setError('L\'email est requis');
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
      setError('Vous devez accepter les conditions générales d\'utilisation');
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
        setError(errorMessage || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: '#F3F4F6',
      '& fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: '2px solid #22C55E',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 14px',
      fontSize: '14px',
      '&::placeholder': {
        color: '#9CA3AF',
        opacity: 1,
      },
    },
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
      {/* Logo */}
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

      {/* Container pour tabs + card */}
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Tabs Connexion / Inscription */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#E5E7EB',
            borderRadius: '9999px',
            padding: '4px',
            marginBottom: '16px',
          }}
        >
          <Link
            to="/login"
            style={{
              flex: 1,
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              color: '#6B7280',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Connexion
          </Link>
          <button
            style={{
              flex: 1,
              padding: '10px 24px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            }}
          >
            Inscription
          </button>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1F2937',
              margin: '0 0 4px 0',
            }}
          >
            Inscription
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#9CA3AF',
              margin: '0 0 24px 0',
            }}
          >
            Créez un compte pour rejoindre la communauté
          </p>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: '12px',
                '& .MuiAlert-message': {
                  fontSize: '14px',
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Prénom et Nom sur la même ligne */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Prénom <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  placeholder="Jean"
                  size="small"
                  sx={inputStyles}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Nom <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  placeholder="Dupont"
                  size="small"
                  sx={inputStyles}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Email <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                autoComplete="email"
                placeholder="vous@exemple.com"
                size="small"
                sx={inputStyles}
              />
            </div>

            {/* Téléphone */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Téléphone
              </label>
              <TextField
                fullWidth
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                placeholder="+33 6 12 34 56 78"
                size="small"
                sx={inputStyles}
              />
            </div>

            {/* Ville et Code postal sur la même ligne */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {/* Ville avec autocomplétion */}
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Ville <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <Autocomplete
                  freeSolo
                  options={citySuggestions}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.city
                  }
                  value={selectedCity}
                  loading={loadingSuggestions}
                  inputValue={cityInputValue}
                  onInputChange={(_event, newValue) => {
                    setCityInputValue(newValue);
                    // Si l'utilisateur tape manuellement, mettre à jour formData.city
                    if (!selectedCity || selectedCity.city !== newValue) {
                      setFormData(prev => ({ ...prev, city: newValue }));
                    }
                  }}
                  onChange={handleCitySelect}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={key} {...otherProps}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{option.city}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{option.postalCode}</div>
                        </div>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Rechercher..."
                      size="small"
                      sx={inputStyles}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSuggestions ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              {/* Code postal - rempli automatiquement */}
              <div style={{ width: '120px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Code postal <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <TextField
                  fullWidth
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  disabled={loading}
                  placeholder="75001"
                  size="small"
                  sx={inputStyles}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div style={{ marginBottom: '8px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Mot de passe <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                autoComplete="new-password"
                placeholder="Créez un mot de passe sécurisé"
                size="small"
                sx={inputStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div style={{ marginBottom: '16px' }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#E5E7EB',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getPasswordStrengthColor(passwordStrength),
                      borderRadius: 3,
                    },
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <PasswordCriteriaItem
                    met={passwordCriteria.minLength(formData.password)}
                    text="12 caractères minimum"
                  />
                  <PasswordCriteriaItem
                    met={passwordCriteria.hasUppercase(formData.password)}
                    text="Une lettre majuscule"
                  />
                  <PasswordCriteriaItem
                    met={passwordCriteria.hasLowercase(formData.password)}
                    text="Une lettre minuscule"
                  />
                  <PasswordCriteriaItem
                    met={passwordCriteria.hasNumber(formData.password)}
                    text="Un chiffre"
                  />
                  <PasswordCriteriaItem
                    met={passwordCriteria.hasSpecialChar(formData.password)}
                    text="Un caractère spécial (!@#$%...)"
                  />
                </div>
              </div>
            )}

            {/* Confirmer mot de passe */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Confirmer le mot de passe <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
                autoComplete="new-password"
                placeholder="Confirmez votre mot de passe"
                size="small"
                sx={inputStyles}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={loading}
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, display: 'block' }}>
                  Les mots de passe ne correspondent pas
                </Typography>
              )}
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Bio (optionnel)
              </label>
              <TextField
                fullWidth
                name="bio"
                multiline
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                placeholder="Parlez-nous de vous et de vos centres d'intérêt..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#F3F4F6',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: '2px solid #22C55E',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    '&::placeholder': {
                      color: '#9CA3AF',
                      opacity: 1,
                    },
                  },
                }}
              />
            </div>

            {/* Checkbox CGU */}
            <div style={{ marginBottom: '24px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={loading}
                    sx={{
                      color: '#D1D5DB',
                      '&.Mui-checked': {
                        color: '#22C55E',
                      },
                    }}
                  />
                }
                label={
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>
                    J'accepte les{' '}
                    <a href="/terms" style={{ color: '#22C55E', textDecoration: 'underline' }}>
                      conditions générales d'utilisation
                    </a>
                    {' '}et la{' '}
                    <a href="/privacy" style={{ color: '#22C55E', textDecoration: 'underline' }}>
                      politique de confidentialité
                    </a>
                    {' '}<span style={{ color: '#EF4444' }}>*</span>
                  </span>
                }
              />
            </div>

            {/* Bouton S'inscrire */}
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
                '&:hover': {
                  backgroundColor: '#16A34A',
                  boxShadow: 'none',
                },
                '&:disabled': {
                  backgroundColor: '#86EFAC',
                },
              }}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher un critère de mot de passe
const PasswordCriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
    {met ? (
      <Check sx={{ fontSize: 14, color: '#22C55E' }} />
    ) : (
      <Close sx={{ fontSize: 14, color: '#D1D5DB' }} />
    )}
    <span style={{ fontSize: '12px', color: met ? '#22C55E' : '#9CA3AF' }}>
      {text}
    </span>
  </div>
);