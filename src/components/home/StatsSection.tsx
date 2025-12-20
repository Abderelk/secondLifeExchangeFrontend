// src/components/home/StatsSection.tsx

import { Box, Container, Card, Typography } from '@mui/material';
import { TrendingUp, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';

export interface StatItem {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

interface StatCardProps {
  stat: StatItem;
}

const StatCard = ({ stat }: StatCardProps) => (
  <Card
    sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #E5E7EB',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ color: '#6B7280' }}>{stat.icon}</Box>
      <Typography sx={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
        {stat.title}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: { xs: '28px', md: '32px' }, fontWeight: 700, color: stat.color, mb: 0.5 }}>
      {stat.value}
    </Typography>
    <Typography sx={{ fontSize: '14px', color: '#9CA3AF' }}>
      {stat.subtitle}
    </Typography>
  </Card>
);

interface StatsSectionProps {
  stats?: StatItem[];
}

// Stats par défaut
const defaultStats: StatItem[] = [
  {
    icon: <TrendingUp />,
    title: "Impact Environnemental",
    value: "1,247",
    subtitle: "objets échangés ce mois-ci",
    color: "#22C55E",
  },
  {
    icon: <FavoriteBorder />,
    title: "Communauté Active",
    value: "3,842",
    subtitle: "membres engagés",
    color: "#22C55E",
  },
  {
    icon: <ChatBubbleOutline />,
    title: "Échanges en Cours",
    value: "127",
    subtitle: "conversations actives",
    color: "#1F2937",
  },
];

export const StatsSection = ({ stats = defaultStats }: StatsSectionProps) => {
  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: -3 }, position: 'relative', zIndex: 10, px: { xs: 2, md: 3 } }}>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: { xs: 2, md: 3 } 
        }}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </Box>
    </Container>
  );
};

export default StatsSection;