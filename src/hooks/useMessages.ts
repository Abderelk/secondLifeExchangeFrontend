import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  type Message,
  type Conversation,
  type ConversationDetails,
} from '../services/messageService';
import { respondToExchange } from '../services/exchangeService';
import socketService from '../services/socketService';

interface UseMessagesProps {
  token: string | null;
  userId?: string;
}

export const useMessages = ({ token, userId }: UseMessagesProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedConversationRef = useRef<Conversation | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!token) return;

    socketService.connect(token);

    const unsubMessage = socketService.onNewMessage((data) => {
      const currentConvId = selectedConversationRef.current?.id;
      const currentUserId = userIdRef.current;

      if (currentConvId === data.conversationId && data.message.senderId !== currentUserId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data.message.id);
          if (exists) return prev;
          return [...prev, {
            id: data.message.id,
            senderId: data.message.senderId,
            senderName: data.message.senderName,
            content: data.message.content,
            timestamp: data.message.timestamp,
            isOwn: false,
          }];
        });
      }

      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? {
              ...c,
              lastMessage: data.message.content,
              lastMessageAt: data.message.timestamp,
              unreadCount: currentConvId === data.conversationId ? 0 : c.unreadCount + 1,
            }
            : c
        )
      );
    });

    const unsubConvUpdate = socketService.onConversationUpdate((data) => {
      const currentConvId = selectedConversationRef.current?.id;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.id
            ? {
              ...c,
              lastMessage: data.lastMessage,
              lastMessageAt: data.lastMessageAt,
              unreadCount: currentConvId === data.id ? 0 : data.unreadCount,
            }
            : c
        )
      );
    });

    const unsubTyping = socketService.onTyping((data) => {
      const currentConvId = selectedConversationRef.current?.id;
      const currentUserId = userIdRef.current;
      if (currentConvId === data.conversationId && data.userId !== currentUserId) {
        setTypingUser(data.isTyping ? data.userId : null);
      }
    });

    return () => {
      unsubMessage();
      unsubConvUpdate();
      unsubTyping();
      socketService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (selectedConversation?.id) {
      socketService.joinConversation(selectedConversation.id);
      socketService.markAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const data = await getMessages(conversationId);
      setConversationDetails(data);
      setMessages(data.messages);
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversations(prev =>
      prev.map(c => c.id === conversation.id ? { ...c, unreadCount: 0 } : c)
    );
    await fetchMessages(conversation.id);
  }, [fetchMessages]);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);

      if (data.length > 0 && window.innerWidth >= 900) {
        selectConversation(data[0]);
      }
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [selectConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleTyping = useCallback(() => {
    if (!selectedConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socketService.startTyping(selectedConversation.id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketService.stopTyping(selectedConversation.id);
    }, 2000);
  }, [selectedConversation, isTyping]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedConversation || sending) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    socketService.stopTyping(selectedConversation.id);

    try {
      setSending(true);
      const sentMessage = await sendMessageApi(selectedConversation.id, content);
      setMessages(prev => [...prev, sentMessage]);
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
      return true;
    } catch (err) {
      console.error('Erreur envoi message:', err);
      return false;
    } finally {
      setSending(false);
    }
  }, [selectedConversation, sending]);

  const acceptExchange = useCallback(async () => {
    const exchangeId = conversationDetails?.conversation.exchangeId;
    if (!exchangeId || exchangeLoading || !selectedConversation) return;

    try {
      setExchangeLoading(true);
      await respondToExchange(exchangeId, { action: 'accept' });

      setConversationDetails(prev => prev ? {
        ...prev,
        conversation: { ...prev.conversation, exchangeStatus: 'accepted' },
      } : null);

      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id ? { ...c, exchangeStatus: 'accepted' } : c
        )
      );
      setSelectedConversation(prev => prev ? { ...prev, exchangeStatus: 'accepted' } : null);

      await sendMessageApi(selectedConversation.id, "J'ai accepté votre proposition d'échange !");
    } catch (err) {
      console.error('Erreur acceptation échange:', err);
    } finally {
      setExchangeLoading(false);
    }
  }, [conversationDetails, exchangeLoading, selectedConversation]);

  const rejectExchange = useCallback(async () => {
    const exchangeId = conversationDetails?.conversation.exchangeId;
    if (!exchangeId || exchangeLoading || !selectedConversation) return;

    try {
      setExchangeLoading(true);
      await respondToExchange(exchangeId, { action: 'reject' });

      setConversationDetails(prev => prev ? {
        ...prev,
        conversation: { ...prev.conversation, exchangeStatus: 'rejected' },
      } : null);

      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversation.id ? { ...c, exchangeStatus: 'rejected' } : c
        )
      );
      setSelectedConversation(prev => prev ? { ...prev, exchangeStatus: 'rejected' } : null);

      await sendMessageApi(selectedConversation.id, "J'ai refusé votre proposition d'échange.");
    } catch (err) {
      console.error('Erreur refus échange:', err);
    } finally {
      setExchangeLoading(false);
    }
  }, [conversationDetails, exchangeLoading, selectedConversation]);

  const closeChat = useCallback(() => {
    if (selectedConversation) {
      socketService.leaveConversation(selectedConversation.id);
    }
    setSelectedConversation(null);
    setConversationDetails(null);
    setMessages([]);
  }, [selectedConversation]);

  return {
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
  };
};

export default useMessages;
