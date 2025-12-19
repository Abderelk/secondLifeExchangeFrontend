// src/components/auth/ForgotPassword.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Email, CheckCircle } from '@mui/icons-material';
import api from '../../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      setEmailSent(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
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

      {/* Container */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Card */}
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {!emailSent ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <Link 
                  to="/login" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    color: '#6B7280', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
                  Retour à la connexion
                </Link>
                
                <h2 
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: '0 0 8px 0',
                  }}
                >
                  Mot de passe oublié ?
                </h2>
                <p 
                  style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                    margin: 0,
                  }}
                >
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

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
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Adresse email
                  </label>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="vous@exemple.com"
                    size="small"
                    disabled={loading}
                    sx={inputStyles}
                  />
                </div>

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
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Email />}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </Button>
              </form>
            </>
          ) : (
            /* Email envoyé - Message de succès */
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <CheckCircle sx={{ fontSize: 32, color: '#22C55E' }} />
              </div>
              
              <h2 
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: '0 0 8px 0',
                }}
              >
                Email envoyé ! 📧
              </h2>
              
              <p 
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 8px 0',
                  lineHeight: 1.6,
                }}
              >
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              
              <p 
                style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  margin: '0 0 24px 0',
                }}
              >
                N'oubliez pas de vérifier vos spams !
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    padding: '10px',
                    borderRadius: '10px',
                    borderColor: '#E5E7EB',
                    color: '#374151',
                    '&:hover': {
                      borderColor: '#D1D5DB',
                      backgroundColor: '#F9FAFB',
                    },
                  }}
                >
                  Essayer avec une autre adresse
                </Button>
                
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#22C55E', 
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};