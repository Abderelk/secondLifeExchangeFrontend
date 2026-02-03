import { Box, Card, Typography, Avatar, Chip } from '@mui/material';
import { LocationOn, Verified } from '@mui/icons-material';

interface ProfileHeaderCardProps {
  initials: string;
  fullName: string;
  bio?: string;
  city?: string;
}

export const ProfileHeaderCard = ({ initials, fullName, bio, city }: ProfileHeaderCardProps) => (
  <Card
    sx={{
      p: { xs: 2.5, md: 4 },
      borderRadius: '16px',
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { xs: 'center', sm: 'flex-start' },
      gap: { xs: 2, sm: 3 },
      textAlign: { xs: 'center', sm: 'left' },
    }}
  >
    <Avatar
      sx={{
        width: { xs: 80, md: 100 },
        height: { xs: 80, md: 100 },
        backgroundColor: '#22C55E',
        fontSize: { xs: 28, md: 36 },
        fontWeight: 600,
      }}
    >
      {initials}
    </Avatar>

    <Box>
      <Typography
        sx={{
          fontSize: { xs: '20px', md: '24px' },
          fontWeight: 700,
          color: '#1F2937',
          mb: 0.5,
        }}
      >
        {fullName}
      </Typography>

      <Typography
        sx={{
          fontSize: '14px',
          color: '#6B7280',
          mb: 1.5,
        }}
      >
        {bio || "Passionné(e) par l'économie circulaire et les échanges responsables"}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        <Chip
          icon={<LocationOn sx={{ fontSize: 16 }} />}
          label={city || 'Paris, France'}
          size="small"
          sx={{
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontWeight: 500,
            '& .MuiChip-icon': { color: '#EF4444' },
          }}
        />
        <Chip
          icon={<Verified sx={{ fontSize: 16 }} />}
          label="Membre vérifié"
          size="small"
          sx={{
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            fontWeight: 500,
            '& .MuiChip-icon': { color: '#16A34A' },
          }}
        />
      </Box>
    </Box>
  </Card>
);

export default ProfileHeaderCard;
