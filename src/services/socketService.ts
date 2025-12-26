// src/services/socketService.ts

import { io, Socket } from 'socket.io-client';

// Types pour les événements
export interface MessageData {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isOwn: boolean;
}

export interface ConversationUpdateData {
    id: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
}

export interface TypingData {
    conversationId: string;
    userId: string;
    isTyping: boolean;
}

type MessageHandler = (data: { conversationId: string; message: MessageData }) => void;
type ConversationUpdateHandler = (data: ConversationUpdateData) => void;
type TypingHandler = (data: TypingData) => void;

class SocketService {
    private socket: Socket | null = null;
    private messageHandlers: Set<MessageHandler> = new Set();
    private conversationUpdateHandlers: Set<ConversationUpdateHandler> = new Set();
    private typingHandlers: Set<TypingHandler> = new Set();
    private currentConversationId: string | null = null;

    /**
     * Connecter au serveur WebSocket
     */
    connect(token: string): void {
        if (this.socket?.connected) {
            console.log('🔌 Socket already connected');
            return;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Enlever /api si présent
        const socketUrl = baseUrl.replace('/api', '');

        console.log('🔌 Connecting to WebSocket:', socketUrl);

        this.socket = io(socketUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket?.id);

            // Rejoindre la conversation actuelle si elle existe
            if (this.currentConversationId) {
                this.joinConversation(this.currentConversationId);
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔌 Socket connection error:', error.message);
        });

        // Écouter les nouveaux messages
        this.socket.on('message:new', (data: { conversationId: string; message: MessageData }) => {
            console.log('📩 New message received:', data);
            this.messageHandlers.forEach((handler) => handler(data));
        });

        // Écouter les mises à jour de conversation
        this.socket.on('conversation:updated', (data: ConversationUpdateData) => {
            console.log('📝 Conversation updated:', data);
            this.conversationUpdateHandlers.forEach((handler) => handler(data));
        });

        // Écouter les indicateurs de frappe
        this.socket.on('user:typing', (data: TypingData) => {
            console.log('⌨️ Typing:', data);
            this.typingHandlers.forEach((handler) => handler(data));
        });

        // Écouter quand les messages sont lus
        this.socket.on('messages:read', (data: { conversationId: string; userId: string }) => {
            console.log('👁️ Messages read:', data);
        });
    }

    /**
     * Déconnecter du serveur WebSocket
     */
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.currentConversationId = null;
            console.log('🔌 Socket disconnected');
        }
    }

    /**
     * Rejoindre une conversation
     */
    joinConversation(conversationId: string): void {
        if (this.currentConversationId && this.currentConversationId !== conversationId) {
            this.leaveConversation(this.currentConversationId);
        }

        this.currentConversationId = conversationId;
        this.socket?.emit('join:conversation', conversationId);
        console.log('🚪 Joined conversation:', conversationId);
    }

    /**
     * Quitter une conversation
     */
    leaveConversation(conversationId: string): void {
        this.socket?.emit('leave:conversation', conversationId);
        if (this.currentConversationId === conversationId) {
            this.currentConversationId = null;
        }
        console.log('🚪 Left conversation:', conversationId);
    }

    /**
     * Indiquer qu'on est en train d'écrire
     */
    startTyping(conversationId: string): void {
        this.socket?.emit('typing:start', { conversationId });
    }

    /**
     * Indiquer qu'on a arrêté d'écrire
     */
    stopTyping(conversationId: string): void {
        this.socket?.emit('typing:stop', { conversationId });
    }

    /**
     * Marquer les messages comme lus
     */
    markAsRead(conversationId: string): void {
        this.socket?.emit('messages:read', { conversationId });
    }

    /**
     * S'abonner aux nouveaux messages
     */
    onNewMessage(handler: MessageHandler): () => void {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    /**
     * S'abonner aux mises à jour de conversation
     */
    onConversationUpdate(handler: ConversationUpdateHandler): () => void {
        this.conversationUpdateHandlers.add(handler);
        return () => this.conversationUpdateHandlers.delete(handler);
    }

    /**
     * S'abonner aux indicateurs de frappe
     */
    onTyping(handler: TypingHandler): () => void {
        this.typingHandlers.add(handler);
        return () => this.typingHandlers.delete(handler);
    }

    /**
     * Vérifier si connecté
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

// Singleton
export const socketService = new SocketService();
export default socketService;