import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  sending: boolean;
  isMobile?: boolean;
}

export const MessageInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  sending,
  isMobile,
}: MessageInputProps) => (
  <Box
    sx={{
      p: 2,
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      gap: 1.5,
      backgroundColor: '#fff',
      pb: isMobile ? 10 : 2,
    }}
  >
    <TextField
      fullWidth
      placeholder="Tapez votre message..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      size="small"
      disabled={sending}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#F9FAFB',
        },
      }}
    />
    <IconButton
      onClick={onSend}
      disabled={!value.trim() || sending}
      sx={{
        backgroundColor: '#22C55E',
        color: '#fff',
        width: 44,
        height: 44,
        '&:hover': { backgroundColor: '#16A34A' },
        '&.Mui-disabled': { backgroundColor: '#E5E7EB', color: '#9CA3AF' },
      }}
    >
      {sending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Send sx={{ fontSize: 20 }} />}
    </IconButton>
  </Box>
);

export default MessageInput;
