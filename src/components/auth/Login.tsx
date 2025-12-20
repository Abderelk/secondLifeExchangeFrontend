// src/components/auth/Login.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading,] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      await login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      console.log(err)
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
            Connexion
          </button>
          <Link
            to="/register"
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
            Inscription
          </Link>
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
            Connexion
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#9CA3AF',
              margin: '0 0 24px 0',
            }}
          >
            Connectez-vous à votre compte pour échanger des objets
          </p>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: '12px',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
                Email
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
                    padding: '12px 14px',
                    fontSize: '14px',
                    '&::placeholder': {
                      color: '#9CA3AF',
                      opacity: 1,
                    },
                  },
                }}
              />
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
                Mot de passe
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
                autoComplete="current-password"
                size="small"
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
                    padding: '12px 14px',
                    fontSize: '14px',
                  },
                }}
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

            {/* Lien mot de passe oublié */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: '13px',
                  color: '#22C55E',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton Se connecter */}
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
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};