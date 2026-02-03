import { Box, Typography, Avatar, Badge, Chip } from '@mui/material';
import { type Conversation } from '../../services/messageService';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  getInitials: (firstName: string, lastName: string) => string;
  formatTime: (dateString: string) => string;
}

export const ConversationsList = ({
  conversations,
  selectedId,
  onSelect,
  getInitials,
  formatTime,
}: ConversationsListProps) => (
  <>
    {conversations.map((conversation) => (
      <Box
        key={conversation.id}
        onClick={() => onSelect(conversation)}
        sx={{
          p: 2,
          display: 'flex',
          gap: 2,
          cursor: 'pointer',
          backgroundColor: selectedId === conversation.id ? '#F0FDF4' : 'transparent',
          borderLeft: selectedId === conversation.id ? '3px solid #22C55E' : '3px solid transparent',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: selectedId === conversation.id ? '#F0FDF4' : '#F9FAFB',
          },
        }}
      >
        <Badge
          badgeContent={conversation.unreadCount}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#22C55E',
              color: '#fff',
            },
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#22C55E',
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {conversation.participant
              ? getInitials(conversation.participant.firstName, conversation.participant.lastName)
              : '?'}
          </Avatar>
        </Badge>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
            <Typography
              sx={{
                fontSize: '15px',
                fontWeight: conversation.unreadCount > 0 ? 700 : 600,
                color: '#1F2937',
              }}
            >
              {conversation.participant
                ? `${conversation.participant.firstName} ${conversation.participant.lastName}`
                : 'Utilisateur'}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '13px',
              color: conversation.unreadCount > 0 ? '#1F2937' : '#6B7280',
              fontWeight: conversation.unreadCount > 0 ? 500 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0.5,
            }}
          >
            {conversation.lastMessage || 'Aucun message'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>
              {formatTime(conversation.lastMessageAt)}
            </Typography>
            {conversation.itemRequested && (
              <Chip
                label={conversation.itemRequested.title}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '11px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontWeight: 500,
                  maxWidth: 120,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    ))}
  </>
);

export default ConversationsList;
