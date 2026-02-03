import { Box, Card, Avatar, IconButton, TextField } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';

interface AvatarSectionProps {
  avatar: string;
  initials: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarSection = ({ avatar, initials, onAvatarChange }: AvatarSectionProps) => (
  <Card sx={{ p: 3, borderRadius: '16px', mb: 3, textAlign: 'center' }}>
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={avatar}
        sx={{
          width: 100,
          height: 100,
          fontSize: 36,
          backgroundColor: '#22C55E',
        }}
      >
        {initials}
      </Avatar>
      <IconButton
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': { backgroundColor: '#F3F4F6' },
        }}
        size="small"
      >
        <CameraAlt sx={{ fontSize: 18, color: '#6B7280' }} />
      </IconButton>
    </Box>

    <TextField
      fullWidth
      size="small"
      placeholder="URL de votre photo de profil"
      name="avatar"
      value={avatar}
      onChange={onAvatarChange}
      sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    />
  </Card>
);

export default AvatarSection;
