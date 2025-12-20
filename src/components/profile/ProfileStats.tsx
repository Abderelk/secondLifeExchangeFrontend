// src/components/profile/ProfileStats.tsx

import { Box, Card, Typography } from '@mui/material';
import { Inventory2, SwapHoriz, Favorite, Visibility } from '@mui/icons-material';

export interface UserStats {
  itemsCount: number;
  exchangesCount: number;
  likesReceived: number;
  viewsCount: number;
}

interface ProfileStatsProps {
  stats: UserStats;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

const StatCard = ({ icon, value, label, color }: StatCardProps) => (
  <Card
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #E5E7EB',
      textAlign: 'center',
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 1.5,
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontSize: { xs: '24px', md: '28px' },
        fontWeight: 700,
        color: '#1F2937',
      }}
    >
      {value}
    </Typography>
    <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
      {label}
    </Typography>
  </Card>
);

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 2, md: 3 },
        mt: { xs: -6, md: -8 },
        position: 'relative',
        zIndex: 10,
      }}
    >
      <StatCard
        icon={<Inventory2 sx={{ color: '#22C55E', fontSize: 24 }} />}
        value={stats.itemsCount}
        label="Objets publiés"
        color="#22C55E"
      />
      <StatCard
        icon={<SwapHoriz sx={{ color: '#3B82F6', fontSize: 24 }} />}
        value={stats.exchangesCount}
        label="Échanges réalisés"
        color="#3B82F6"
      />
      <StatCard
        icon={<Favorite sx={{ color: '#EF4444', fontSize: 24 }} />}
        value={stats.likesReceived}
        label="Likes reçus"
        color="#EF4444"
      />
      <StatCard
        icon={<Visibility sx={{ color: '#8B5CF6', fontSize: 24 }} />}
        value={stats.viewsCount}
        label="Vues totales"
        color="#8B5CF6"
      />
    </Box>
  );
};

export default ProfileStats;