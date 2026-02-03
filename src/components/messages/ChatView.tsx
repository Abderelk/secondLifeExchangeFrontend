import { Box } from '@mui/material';
import { type Conversation, type Message, type ConversationDetails } from '../../services/messageService';
import { ChatHeader } from './ChatHeader';
import { ExchangeItemsCard } from './ExchangeItemsCard';
import { MessagesList } from './MessagesList';
import { MessageInput } from './MessageInput';

interface ChatViewProps {
  conversation: Conversation;
  conversationDetails: ConversationDetails | null;
  messages: Message[];
  newMessage: string;
  loadingMessages: boolean;
  sending: boolean;
  typingUser: string | null;
  exchangeLoading: boolean;
  onNewMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onAcceptExchange: () => void;
  onRejectExchange: () => void;
  onBack?: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  getInitials: (firstName: string, lastName: string) => string;
  formatMessageTime: (dateString: string) => string;
  navigate: (path: string) => void;
  isMobile?: boolean;
}

export const ChatView = ({
  conversation,
  conversationDetails,
  messages,
  newMessage,
  loadingMessages,
  sending,
  typingUser,
  exchangeLoading,
  onNewMessageChange,
  onSend,
  onKeyPress,
  onAcceptExchange,
  onRejectExchange,
  onBack,
  messagesEndRef,
  getInitials,
  formatMessageTime,
  navigate,
  isMobile,
}: ChatViewProps) => {
  const itemOffered = conversationDetails?.conversation.itemOffered;
  const itemRequested = conversationDetails?.conversation.itemRequested;
  const exchangeStatus = conversationDetails?.conversation.exchangeStatus || conversation.exchangeStatus;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'calc(100vh - 60px)' : '100%' }}>
      <ChatHeader
        conversation={conversation}
        exchangeStatus={exchangeStatus || undefined}
        typingUser={typingUser}
        itemRequestedTitle={itemRequested?.title}
        isMobile={isMobile}
        onBack={onBack}
        getInitials={getInitials}
      />

      <ExchangeItemsCard
        itemOffered={itemOffered}
        itemRequested={itemRequested}
        isOwner={conversationDetails?.conversation.isOwner || false}
        exchangeStatus={exchangeStatus ?? ''}
        exchangeLoading={exchangeLoading}
        onAcceptExchange={onAcceptExchange}
        onRejectExchange={onRejectExchange}
        onNavigate={navigate}
      />

      <MessagesList
        messages={messages}
        loading={loadingMessages}
        formatMessageTime={formatMessageTime}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSend={onSend}
        onKeyPress={onKeyPress}
        sending={sending}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default ChatView;
