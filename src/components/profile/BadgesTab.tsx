import { Box, Card, Typography, Chip } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  obtained: boolean;
}

interface BadgesTabProps {
  badges: Badge[];
}

export const BadgesTab = ({ badges }: BadgesTabProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {badges.map((badge) => (
      <Card
        key={badge.id}
        sx={{
          p: 2.5,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          opacity: badge.obtained ? 1 : 0.6,
          border: badge.obtained ? '2px solid #22C55E' : '1px solid #E5E7EB',
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '12px',
            backgroundColor: badge.obtained ? '#DCFCE7' : '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EmojiEvents sx={{ fontSize: 28, color: badge.obtained ? '#22C55E' : '#9CA3AF' }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
            {badge.title}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
            {badge.description}
          </Typography>
        </Box>

        {badge.obtained && (
          <Chip
            label="Obtenu"
            size="small"
            sx={{
              backgroundColor: '#22C55E',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '12px',
            }}
          />
        )}
      </Card>
    ))}
  </Box>
);

export default BadgesTab;
