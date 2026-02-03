// src/pages/ThemeCalendarPage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    CalendarMonth,
    Notifications,
    NotificationsOff,
    ArrowForward,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import {
    getThemeCalendar,
    getUpcomingThemes,
    getNotificationPreferences,
    updateNotificationPreferences,
    type WeeklyTheme,
    type NotificationPreferences,
} from '../services/themeService';

const MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const ThemeCalendarPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [themes, setThemes] = useState<WeeklyTheme[]>([]);
    const [upcomingThemes, setUpcomingThemes] = useState<WeeklyTheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
    const [savingPrefs, setSavingPrefs] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });



    useEffect(() => {
        if (isAuthenticated) {
            fetchNotificationPrefs();
        }
    }, [isAuthenticated]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [themesData, upcomingData] = await Promise.all([
                getThemeCalendar(currentMonth, currentYear),
                getUpcomingThemes(),
            ]);
            setThemes(themesData);
            setUpcomingThemes(upcomingData);
        } catch (err) {
            console.error('Erreur chargement thèmes:', err);
        } finally {
            setLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchNotificationPrefs = async () => {
        try {
            const prefs = await getNotificationPreferences();
            setNotificationPrefs(prefs);
        } catch (err) {
            console.error('Erreur chargement préférences:', err);
        }
    };

    const handleToggleNotification = async () => {
        if (!notificationPrefs) return;

        try {
            setSavingPrefs(true);
            const newValue = !notificationPrefs.weeklyTheme;
            const updated = await updateNotificationPreferences({ weeklyTheme: newValue });
            setNotificationPrefs(updated);
            setSnackbar({
                open: true,
                message: newValue ? 'Notifications activées !' : 'Notifications désactivées',
                severity: 'success',
            });
        } catch {
            setSnackbar({
                open: true,
                message: 'Erreur lors de la mise à jour',
                severity: 'error',
            });
        } finally {
            setSavingPrefs(false);
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'current':
                return '#22C55E';
            case 'upcoming':
                return '#3B82F6';
            case 'past':
                return '#9CA3AF';
            default:
                return '#6B7280';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'current':
                return 'En cours';
            case 'upcoming':
                return 'À venir';
            case 'past':
                return 'Terminé';
            default:
                return '';
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header activePage="calendar" />

            <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <CalendarMonth sx={{ fontSize: 32, color: '#22C55E' }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1F2937' }}>
                            Calendrier des Thèmes
                        </Typography>
                    </Box>
                    <Typography sx={{ color: '#6B7280' }}>
                        Découvrez les thèmes hebdomadaires et planifiez vos échanges !
                    </Typography>
                </Box>

                {/* Notification Settings */}
                {isAuthenticated && notificationPrefs && (
                    <Card sx={{ mb: 4, borderRadius: '16px' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {notificationPrefs.weeklyTheme ? (
                                    <Notifications sx={{ color: '#22C55E' }} />
                                ) : (
                                    <NotificationsOff sx={{ color: '#9CA3AF' }} />
                                )}
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                        Notifications par email
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                        Recevez un email chaque semaine pour découvrir le nouveau thème
                                    </Typography>
                                </Box>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationPrefs.weeklyTheme}
                                        onChange={handleToggleNotification}
                                        disabled={savingPrefs}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#22C55E',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#22C55E',
                                            },
                                        }}
                                    />
                                }
                                label=""
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Upcoming Themes Preview */}
                {upcomingThemes.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937', mb: 2 }}>
                            🔮 Prochains thèmes
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                            {upcomingThemes.slice(0, 4).map((theme) => (
                                <Card
                                    key={theme._id}
                                    sx={{
                                        minWidth: 200,
                                        borderRadius: '12px',
                                        border: '2px solid #E5E7EB',
                                        flexShrink: 0,
                                    }}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography sx={{ fontSize: 32, mb: 1 }}>{theme.emoji}</Typography>
                                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1F2937', mb: 0.5 }}>
                                            {theme.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: '#6B7280' }}>
                                            {formatDate(theme.startDate)} - {formatDate(theme.endDate)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Month Navigation */}
                <Card sx={{ mb: 3, borderRadius: '16px' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <IconButton onClick={handlePreviousMonth}>
                            <ChevronLeft />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
                            {MONTHS[currentMonth - 1]} {currentYear}
                        </Typography>
                        <IconButton onClick={handleNextMonth}>
                            <ChevronRight />
                        </IconButton>
                    </CardContent>
                </Card>

                {/* Themes List */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#22C55E' }} />
                    </Box>
                ) : themes.length === 0 ? (
                    <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 48, mb: 2 }}>📅</Typography>
                            <Typography variant="h6" sx={{ color: '#6B7280' }}>
                                Aucun thème prévu pour ce mois
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {themes.map((theme) => (
                            <Card
                                key={theme._id}
                                sx={{
                                    borderRadius: '16px',
                                    border: theme.status === 'current' ? '2px solid #22C55E' : '1px solid #E5E7EB',
                                    backgroundColor: theme.status === 'current' ? '#F0FDF4' : '#fff',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    },
                                }}
                                onClick={() => navigate('/home')}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                        {/* Emoji */}
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '16px',
                                                backgroundColor: theme.status === 'current' ? '#DCFCE7' : '#F3F4F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 40,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {theme.emoji}
                                        </Box>

                                        {/* Content */}
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
                                                    {theme.title}
                                                </Typography>
                                                <Chip
                                                    label={getStatusLabel(theme.status)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${getStatusColor(theme.status)}20`,
                                                        color: getStatusColor(theme.status),
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Box>

                                            <Typography sx={{ color: '#6B7280', mb: 2, fontSize: 14 }}>
                                                {theme.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>
                                                        📅 {formatDate(theme.startDate)} - {formatDate(theme.endDate)}
                                                    </Typography>
                                                    {theme.status === 'current' && theme.daysRemaining && (
                                                        <Chip
                                                            label={`${theme.daysRemaining} jour${theme.daysRemaining > 1 ? 's' : ''} restant${theme.daysRemaining > 1 ? 's' : ''}`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#FEF3C7',
                                                                color: '#D97706',
                                                                fontWeight: 500,
                                                                fontSize: 11,
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                {theme.status === 'current' && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#22C55E', fontWeight: 600, fontSize: 14 }}>
                                                        Voir les échanges <ArrowForward sx={{ fontSize: 18, ml: 0.5 }} />
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Categories */}
                                            {theme.categories && theme.categories.length > 0 && (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                                    {theme.categories.slice(0, 5).map((category) => (
                                                        <Chip
                                                            key={category}
                                                            label={category}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#F3F4F6',
                                                                color: '#374151',
                                                                fontSize: 11,
                                                                height: 24,
                                                            }}
                                                        />
                                                    ))}
                                                    {theme.categories.length > 5 && (
                                                        <Chip
                                                            label={`+${theme.categories.length - 5}`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#E5E7EB',
                                                                color: '#6B7280',
                                                                fontSize: 11,
                                                                height: 24,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Legend */}
                <Box sx={{ mt: 4, display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#22C55E' }} />
                        <Typography sx={{ fontSize: 13, color: '#6B7280' }}>En cours</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                        <Typography sx={{ fontSize: 13, color: '#6B7280' }}>À venir</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                        <Typography sx={{ fontSize: 13, color: '#6B7280' }}>Terminé</Typography>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: '10px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Footer />
            <BottomNavigation />
        </Box>
    );
};

export default ThemeCalendarPage;