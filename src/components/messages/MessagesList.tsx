import { Box, Typography, CircularProgress } from '@mui/material';
import { type Message } from '../../services/messageService';

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  formatMessageTime: (dateString: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessagesList = ({
  messages,
  loading,
  formatMessageTime,
  messagesEndRef,
}: MessagesListProps) => (
  <Box
    sx={{
      flex: 1,
      overflowY: 'auto',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    {loading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#22C55E' }} size={30} />
      </Box>
    ) : messages.length === 0 ? (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: '#9CA3AF' }}>
          Aucun message. Commencez la conversation !
        </Typography>
      </Box>
    ) : (
      messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
          }}
        >
          <Box
            sx={{
              maxWidth: '75%',
              p: 2,
              borderRadius: message.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: message.isOwn ? '#22C55E' : '#F3F4F6',
              color: message.isOwn ? '#fff' : '#1F2937',
            }}
          >
            <Typography sx={{ fontSize: '14px', lineHeight: 1.5 }}>
              {message.content}
            </Typography>
            <Typography
              sx={{
                fontSize: '11px',
                color: message.isOwn ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
                mt: 0.5,
              }}
            >
              {formatMessageTime(message.timestamp)}
            </Typography>
          </Box>
        </Box>
      ))
    )}
    <div ref={messagesEndRef} />
  </Box>
);

export default MessagesList;
