import { Box, Typography, Chip } from '@mui/material';
import { type Theme } from '../../types/theme';

interface CurrentThemeCardProps {
  theme: Theme;
}

const CurrentThemeCard = ({ theme }: CurrentThemeCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: 3,
        border: '2px solid #22C55E',
        mb: 5,
      }}
    >
      {/* Badge Thème actuel */}
      <Chip
        label="Thème actuel"
        sx={{
          backgroundColor: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '13px',
          height: '28px',
          mb: 2.5,
        }}
      />

      {/* Contenu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}
        >
          {theme.icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#1F2937">
            {theme.name}
          </Typography>
          <Typography variant="body2" color="#6B7280">
            Semaine {theme.week} • {theme.dateRange}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" color="#4B5563">
        {theme.description}
      </Typography>
    </Box>
  );
};

export default CurrentThemeCard;