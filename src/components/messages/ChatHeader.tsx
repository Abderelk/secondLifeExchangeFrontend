import { Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import { ArrowBack, Schedule, CheckCircle, Cancel } from '@mui/icons-material';
import { type Conversation } from '../../services/messageService';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactElement }> = {
  pending: { label: 'En attente', color: '#F59E0B', icon: <Schedule sx={{ fontSize: 16 }} /> },
  accepted: { label: 'Accepté', color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  completed: { label: 'Terminé', color: '#6B7280', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  rejected: { label: 'Refusé', color: '#EF4444', icon: <Cancel sx={{ fontSize: 16 }} /> },
  cancelled: { label: 'Annulé', color: '#6B7280', icon: <Cancel sx={{ fontSize: 16 }} /> },
};

interface ChatHeaderProps {
  conversation: Conversation;
  exchangeStatus?: string;
  typingUser: string | null;
  itemRequestedTitle?: string;
  isMobile?: boolean;
  onBack?: () => void;
  getInitials: (firstName: string, lastName: string) => string;
}

export const ChatHeader = ({
  conversation,
  exchangeStatus,
  typingUser,
  itemRequestedTitle,
  isMobile,
  onBack,
  getInitials,
}: ChatHeaderProps) => {
  const status = exchangeStatus ? statusConfig[exchangeStatus] : null;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {isMobile && (
        <IconButton onClick={onBack} sx={{ mr: -1 }}>
          <ArrowBack />
        </IconButton>
      )}
      <Avatar
        sx={{
          width: 44,
          height: 44,
          backgroundColor: '#22C55E',
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        {conversation.participant
          ? getInitials(conversation.participant.firstName, conversation.participant.lastName)
          : '?'}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
          {conversation.participant
            ? `${conversation.participant.firstName} ${conversation.participant.lastName}`
            : 'Utilisateur'}
        </Typography>
        {typingUser ? (
          <Typography sx={{ fontSize: '13px', color: '#22C55E', fontStyle: 'italic' }}>
            En train d'écrire...
          </Typography>
        ) : itemRequestedTitle ? (
          <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
            Échange : {itemRequestedTitle}
          </Typography>
        ) : null}
      </Box>
      {status && (
        <Chip
          icon={status.icon}
          label={status.label}
          size="small"
          sx={{
            backgroundColor: `${status.color}20`,
            color: status.color,
            fontWeight: 600,
            '& .MuiChip-icon': { color: status.color },
          }}
        />
      )}
    </Box>
  );
};

export default ChatHeader;
