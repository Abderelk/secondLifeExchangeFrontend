// src/components/home/WeeklyThemeBanner.tsx

import { Box, Container, Typography, Button } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface WeeklyTheme {
  title: string;
  emoji: string;
  dateRange: string;
  description: string;
}

interface WeeklyThemeBannerProps {
  theme: WeeklyTheme;
}

export const WeeklyThemeBanner = ({ theme }: WeeklyThemeBannerProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #2563EB 100%)',
        py: 6,
        color: '#FFFFFF',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarMonth />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '14px', opacity: 0.9, mb: 0.5 }}>
              Thème de la semaine
            </Typography>
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 700,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {theme.emoji} {theme.title}
            </Typography>
            <Typography sx={{ fontSize: '14px', opacity: 0.9, mb: 1 }}>
              {theme.dateRange}
            </Typography>
            <Typography sx={{ fontSize: '16px', opacity: 0.95, mb: 3 }}>
              {theme.description}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/calendar')}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                px: 3,
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
            >
              Voir le calendrier des thèmes
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WeeklyThemeBanner;