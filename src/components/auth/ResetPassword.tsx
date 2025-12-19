// src/components/auth/ResetPassword.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Check, Close, CheckCircle, ErrorOutline } from '@mui/icons-material';
import api from '../../services/api';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
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

        setLoading(true);

        try {
            await api.post('/auth/reset-password', {
                token,
                password: formData.password,
            });

            setSuccess(true);

            // Rediriger vers login après 3 secondes
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';

            if (errorMessage.includes('invalide') || errorMessage.includes('expiré')) {
                setTokenValid(false);
            }
            setError(errorMessage);
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
        },
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Token invalide ou expiré
    if (!tokenValid) {
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
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '32px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#FEE2E2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                            }}
                        >
                            <ErrorOutline sx={{ fontSize: 32, color: '#EF4444' }} />
                        </div>

                        <h2
                            style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#1F2937',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Lien expiré ou invalide
                        </h2>

                        <p
                            style={{
                                fontSize: '14px',
                                color: '#6B7280',
                                margin: '0 0 24px 0',
                                lineHeight: 1.6,
                            }}
                        >
                            Ce lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure pour des raisons de sécurité.
                        </p>

                        <Link
                            to="/forgot-password"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                fullWidth
                                variant="contained"
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
                                }}
                            >
                                Demander un nouveau lien
                            </Button>
                        </Link>

                        <Link
                            to="/login"
                            style={{
                                display: 'block',
                                marginTop: '16px',
                                color: '#6B7280',
                                textDecoration: 'none',
                                fontSize: '14px',
                            }}
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Succès
    if (success) {
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
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '24px',
                            padding: '32px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            textAlign: 'center',
                        }}
                    >
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
                            Mot de passe réinitialisé ! 🎉
                        </h2>

                        <p
                            style={{
                                fontSize: '14px',
                                color: '#6B7280',
                                margin: '0 0 16px 0',
                                lineHeight: 1.6,
                            }}
                        >
                            Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion...
                        </p>

                        <CircularProgress size={24} sx={{ color: '#22C55E' }} />

                        <Link
                            to="/login"
                            style={{
                                display: 'block',
                                marginTop: '24px',
                                color: '#22C55E',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Se connecter maintenant
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Formulaire de réinitialisation
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
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: '0 0 8px 0',
                        }}
                    >
                        Nouveau mot de passe
                    </h2>
                    <p
                        style={{
                            fontSize: '14px',
                            color: '#9CA3AF',
                            margin: '0 0 24px 0',
                        }}
                    >
                        Choisissez un nouveau mot de passe sécurisé pour votre compte.
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
                        {/* Nouveau mot de passe */}
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
                                Nouveau mot de passe
                            </label>
                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Créez un mot de passe sécurisé"
                                size="small"
                                disabled={loading}
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

                        {/* Indicateur de force */}
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
                                Confirmer le mot de passe
                            </label>
                            <TextField
                                fullWidth
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmez votre mot de passe"
                                size="small"
                                disabled={loading}
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
                                <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>
                                    Les mots de passe ne correspondent pas
                                </p>
                            )}
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
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
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