// src/components/auth/Login.tsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Box
} from '@mui/material';
import { Visibility, VisibilityOff, Nature, Login as LoginIcon } from '@mui/icons-material';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white text-center">
          <Nature style={{ fontSize: 64 }} className="mb-3" />
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Connexion
          </Typography>
          <Typography variant="body1" className="text-emerald-50">
            Bon retour sur SecondLife Exchange 🌿
          </Typography>
        </div>

        <CardContent className="p-8">
          {error && (
            <Alert severity="error" className="mb-6 border-l-4 border-red-500">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              autoComplete="email"
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
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 mt-6 py-3 shadow-lg"
              style={{ backgroundColor: loading ? undefined : '#059669' }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <Box className="mt-8 space-y-4">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-800 font-semibold underline-offset-2 hover:underline"
                >
                  Créer un compte
                </Link>
              </Typography>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border-2 border-emerald-200">
              <Typography variant="caption" className="text-emerald-800 block text-center">
                🌱 Rejoignez notre communauté pour l'économie circulaire
              </Typography>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};