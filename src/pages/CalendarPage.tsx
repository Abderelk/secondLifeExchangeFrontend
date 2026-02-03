// FRONTEND/src/pages/CalendarPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  IconButton,
  Skeleton,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { getCalendar, getCurrentTheme, type Theme } from '../services/themeService';
import { CurrentThemeCard, ThemeCard, HowItWorks } from '../components/calendar';

// Skeleton pour le chargement
const ThemeCardSkeleton: React.FC = () => (
  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: 2 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rounded" width={70} height={24} />
      </Box>
      <Skeleton variant="text" width="80%" height={28} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const CalendarPage: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentThemeState] = useState<Theme | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [calendarData, current] = await Promise.all([
          getCalendar(selectedYear),
          getCurrentTheme(),
        ]);

        setThemes(calendarData);
        setCurrentThemeState(current);
      } catch (err) {
        console.error('Erreur chargement calendrier:', err);
        setError('Impossible de charger le calendrier des thèmes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Navigation années
  const handlePrevYear = () => setSelectedYear((y) => y - 1);
  const handleNextYear = () => setSelectedYear((y) => y + 1);

  // Grouper les thèmes par mois
  const themesByMonth = themes.reduce(
    (acc, theme) => {
      const month = new Date(theme.startDate).getMonth();
      if (!acc[month]) acc[month] = [];
      acc[month].push(theme);
      return acc;
    },
    {} as Record<number, Theme[]>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          📅 Calendrier des Thèmes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consultez le calendrier et planifiez vos échanges selon les thèmes de chaque semaine !
        </Typography>
      </Box>

      {/* Erreur */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Thème actuel */}
      {!loading && currentTheme && selectedYear === new Date().getFullYear() && (
        <CurrentThemeCard theme={currentTheme} />
      )}

      {/* Navigation année */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          mb: 4,
          border: '1px solid #e5e7eb',
          borderRadius: 2,
        }}
      >
        <IconButton onClick={handlePrevYear} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 100, textAlign: 'center' }}>
          {selectedYear}
        </Typography>
        <IconButton onClick={handleNextYear} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Paper>

      {/* Grille des thèmes par mois */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ThemeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : themes.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
          }}
        >
          <CalendarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Aucun thème pour {selectedYear}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les thèmes pour cette année n'ont pas encore été planifiés.
          </Typography>
        </Paper>
      ) : (
        Object.entries(themesByMonth)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([monthIndex, monthThemes]) => (
            <Box key={monthIndex} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid #22c55e',
                  display: 'inline-block',
                }}
              >
                {MONTH_NAMES[Number(monthIndex)]} {selectedYear}
              </Typography>

              <Grid container spacing={2}>
                {monthThemes.map((theme) => (
                  <Grid key={theme._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ThemeCard theme={theme} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
      )}

      {/* Comment ça marche */}
      <HowItWorks />
    </Container>
  );
};

export default CalendarPage;