import { Card, Tabs, Tab } from '@mui/material';
import { Settings, Inventory2, EmojiEvents } from '@mui/icons-material';

type TabValue = 'profile' | 'items' | 'badges';

interface ProfileTabsProps {
  value: TabValue;
  onChange: (newValue: TabValue) => void;
}

export const ProfileTabs = ({ value, onChange }: ProfileTabsProps) => (
  <Card sx={{ borderRadius: '12px', mb: 3 }}>
    <Tabs
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      variant="fullWidth"
      sx={{
        '& .MuiTabs-indicator': { backgroundColor: '#22C55E' },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '14px',
          color: '#6B7280',
          py: 1.5,
          '&.Mui-selected': { color: '#22C55E' },
        },
      }}
    >
      <Tab value="profile" icon={<Settings sx={{ fontSize: 20 }} />} iconPosition="start" label="Profil" />
      <Tab value="items" icon={<Inventory2 sx={{ fontSize: 20 }} />} iconPosition="start" label="Mes Objets" />
      <Tab value="badges" icon={<EmojiEvents sx={{ fontSize: 20 }} />} iconPosition="start" label="Badges" />
    </Tabs>
  </Card>
);

export default ProfileTabs;
