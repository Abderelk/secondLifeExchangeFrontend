// src/services/messageService.ts

import api from './api';

export interface ConversationItem {
  id: string;
  title: string;
  image: string | null;
}

export interface ConversationParticipant {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  participant: ConversationParticipant | null;
  itemOffered: ConversationItem | null;
  itemRequested: ConversationItem | null;
  exchangeId: string | null;
  exchangeStatus: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | null;
  isOwner: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ConversationDetails {
  conversation: {
    id: string;
    participant: ConversationParticipant | null;
    exchangeId: string | null;
    exchangeStatus: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | null;
    isOwner: boolean;
    itemOffered: {
      _id: string;
      title: string;
      images?: string[];
      description?: string;
      category?: string;
    } | null;
    itemRequested: {
      _id: string;
      title: string;
      images?: string[];
      description?: string;
      category?: string;
    } | null;
  };
  messages: Message[];
}

// Récupérer toutes les conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/messages/conversations');
  return response.data.data;
};

// Récupérer les messages d'une conversation
export const getMessages = async (conversationId: string): Promise<ConversationDetails> => {
  const response = await api.get(`/messages/conversations/${conversationId}`);
  return response.data.data;
};

// Envoyer un message
export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  const response = await api.post(`/messages/conversations/${conversationId}`, { content });
  return response.data.data;
};

// Créer ou récupérer une conversation
export const createConversation = async (data: {
  participantId: string;
  itemOfferedId?: string;
  itemRequestedId?: string;
  exchangeId?: string;
}): Promise<{ id: string; existing: boolean }> => {
  const response = await api.post('/messages/conversations', data);
  return { id: response.data.data.id, existing: response.data.existing || false };
};

// Récupérer le nombre de messages non lus
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/messages/unread');
  return response.data.data.unreadCount;
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  getUnreadCount,
};