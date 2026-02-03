// src/pages/MessagesPage.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../hooks/useMessages';
import {
  ConversationsList,
  ChatView,
  EmptyState,
} from '../components/messages';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR');
};

const formatMessageTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

export const MessagesPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    conversations,
    selectedConversation,
    conversationDetails,
    messages,
    loading,
    loadingMessages,
    sending,
    typingUser,
    exchangeLoading,
    selectConversation,
    sendMessage,
    acceptExchange,
    rejectExchange,
    closeChat,
    handleTyping,
  } = useMessages({ token, userId: user?._id });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (await sendMessage(newMessage)) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.participant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.itemRequested?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.itemOffered?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!loading && conversations.length === 0) {
    return <EmptyState onNavigate={() => navigate('/home')} />;
  }

  const searchField = (
    <TextField
      fullWidth
      placeholder="Rechercher..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#9CA3AF' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#F9FAFB' } }}
    />
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Mobile View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {!selectedConversation ? (
          <Box sx={{ pb: 10 }}>
            <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', mb: 2 }}>
                Messagerie
              </Typography>
              {searchField}
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#22C55E' }} />
              </Box>
            ) : (
              <ConversationsList
                conversations={filteredConversations}
                selectedId={null}
                onSelect={selectConversation}
                getInitials={getInitials}
                formatTime={formatTime}
              />
            )}
          </Box>
        ) : (
          <ChatView
            conversation={selectedConversation}
            conversationDetails={conversationDetails}
            messages={messages}
            newMessage={newMessage}
            loadingMessages={loadingMessages}
            sending={sending}
            typingUser={typingUser}
            exchangeLoading={exchangeLoading}
            onNewMessageChange={(value) => { setNewMessage(value); handleTyping(); }}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            onAcceptExchange={acceptExchange}
            onRejectExchange={rejectExchange}
            onBack={closeChat}
            messagesEndRef={messagesEndRef}
            getInitials={getInitials}
            formatMessageTime={formatMessageTime}
            navigate={navigate}
            isMobile
          />
        )}
      </Box>

      {/* Desktop View */}
      <Container
        maxWidth="xl"
        sx={{
          display: { xs: 'none', md: 'flex' },
          gap: 0,
          py: 3,
          px: { md: 3 },
          pb: 6,
          height: 'calc(100vh - 180px)',
        }}
      >
        <Box
          sx={{
            width: 400,
            backgroundColor: '#fff',
            borderRadius: '16px 0 0 16px',
            border: '1px solid #E5E7EB',
            borderRight: 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', mb: 2 }}>
              Conversations
            </Typography>
            {searchField}
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#22C55E' }} />
              </Box>
            ) : (
              <ConversationsList
                conversations={filteredConversations}
                selectedId={selectedConversation?.id || null}
                onSelect={selectConversation}
                getInitials={getInitials}
                formatTime={formatTime}
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: '0 16px 16px 0',
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {selectedConversation ? (
            <ChatView
              conversation={selectedConversation}
              conversationDetails={conversationDetails}
              messages={messages}
              newMessage={newMessage}
              loadingMessages={loadingMessages}
              sending={sending}
              typingUser={typingUser}
              exchangeLoading={exchangeLoading}
              onNewMessageChange={(value) => { setNewMessage(value); handleTyping(); }}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              onAcceptExchange={acceptExchange}
              onRejectExchange={rejectExchange}
              messagesEndRef={messagesEndRef}
              getInitials={getInitials}
              formatMessageTime={formatMessageTime}
              navigate={navigate}
            />
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              <Typography>Sélectionnez une conversation</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MessagesPage;
