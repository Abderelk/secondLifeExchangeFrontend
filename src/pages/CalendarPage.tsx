import { Box, Container, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { Header } from '../components/layout/Header';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import CurrentThemeCard from '../components/calendar/CurrentThemeCard';
import ThemeCard from '../components/calendar/ThemeCard';
import HowItWorks from '../components/calendar/HowItWorks';
import { themesData } from '../data/themesData';
import { Footer } from '../components/layout/Footer';

const CalendarPage = () => {
  const currentTheme = themesData.find((t) => t.status === 'current');
  const allThemes = themesData;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Header activePage="calendar" />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#1F2937"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}
          >
            <CalendarMonth sx={{ color: '#22C55E' }} />
            Calendrier des Thèmes
          </Typography>
          <Typography variant="body1" color="#6B7280" sx={{ lineHeight: 1.6 }}>
            Chaque semaine, un nouveau thème d'échange est proposé pour encourager la diversité des objets partagés et faciliter la recherche. Suivez le calendrier et planifiez vos échanges !
          </Typography>
        </Box>

        {/* Thème actuel */}
        {currentTheme && <CurrentThemeCard theme={currentTheme} />}

        {/* Section Tous les thèmes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} color="#1F2937" sx={{ mb: 2.5 }}>
            Tous les thèmes
          </Typography>

          <Grid container spacing={2.5}>
            {allThemes.map((theme) => (
              <Grid size={{ xs: 12, md: 6 }} key={theme.id}>
                <ThemeCard theme={theme} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Comment ça marche */}
        <HowItWorks />

      </Container>
      <Footer />
      <BottomNavigation />
    </Box>
  );
};

export default CalendarPage;