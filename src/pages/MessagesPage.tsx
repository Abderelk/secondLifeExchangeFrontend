// src/pages/MessagesPage.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Avatar,
    TextField,
    IconButton,
    Badge,
    InputAdornment,
    Chip,
    CircularProgress,
    Card,
    CardMedia,
    Button,
} from '@mui/material';
import {
    Search,
    Send,
    ArrowBack,
    SwapHoriz,
    CheckCircle,
    Schedule,
    Cancel,
} from '@mui/icons-material';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import {
    getConversations,
    getMessages,
    sendMessage as sendMessageApi,
    type Conversation,
    type Message,
    type ConversationDetails,
} from '../services/messageService';
import socketService from '../services/socketService';

// Status config
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactElement }> = {
    pending: { label: 'En attente', color: '#F59E0B', icon: <Schedule sx={{ fontSize: 16 }} /> },
    accepted: { label: 'Accepté', color: '#22C55E', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    completed: { label: 'Terminé', color: '#6B7280', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    rejected: { label: 'Refusé', color: '#EF4444', icon: <Cancel sx={{ fontSize: 16 }} /> },
    cancelled: { label: 'Annulé', color: '#6B7280', icon: <Cancel sx={{ fontSize: 16 }} /> },
};

export const MessagesPage = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🔌 Initialiser Socket.IO
    useEffect(() => {
        if (token) {
            console.log('🔌 Connecting to WebSocket...');
            socketService.connect(token);

            // Écouter les nouveaux messages
            const unsubMessage = socketService.onNewMessage((data) => {
                console.log('📩 New message received via WebSocket:', data);

                // Si c'est pour la conversation actuelle, ajouter le message
                if (selectedConversation?.id === data.conversationId) {
                    // Ne pas ajouter si c'est notre propre message (déjà ajouté localement)
                    if (data.message.senderId !== user?._id) {
                        setMessages((prev) => {
                            // Vérifier si le message existe déjà
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
                }

                // Mettre à jour la liste des conversations
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === data.conversationId
                            ? {
                                ...c,
                                lastMessage: data.message.content,
                                lastMessageAt: data.message.timestamp,
                                unreadCount: selectedConversation?.id === data.conversationId ? 0 : c.unreadCount + 1,
                            }
                            : c
                    )
                );
            });

            // Écouter les mises à jour de conversation
            const unsubConvUpdate = socketService.onConversationUpdate((data) => {
                console.log('🔄 Conversation updated via WebSocket:', data);

                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === data.id
                            ? {
                                ...c,
                                lastMessage: data.lastMessage,
                                lastMessageAt: data.lastMessageAt,
                                unreadCount: selectedConversation?.id === data.id ? 0 : data.unreadCount,
                            }
                            : c
                    )
                );
            });

            // Écouter les indicateurs de frappe
            const unsubTyping = socketService.onTyping((data) => {
                if (selectedConversation?.id === data.conversationId && data.userId !== user?._id) {
                    setTypingUser(data.isTyping ? data.userId : null);
                }
            });

            return () => {
                unsubMessage();
                unsubConvUpdate();
                unsubTyping();
                socketService.disconnect();
            };
        }
    }, [token, user?._id, selectedConversation?.id]);

    // Rejoindre/quitter la conversation sélectionnée
    useEffect(() => {
        if (selectedConversation?.id) {
            socketService.joinConversation(selectedConversation.id);
            socketService.markAsRead(selectedConversation.id);
        }
    }, [selectedConversation?.id]);

    // Charger les messages d'une conversation
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

    // Sélectionner une conversation
    const handleSelectConversation = useCallback(async (conversation: Conversation) => {
        setSelectedConversation(conversation);

        // Marquer comme lu localement
        setConversations(prev =>
            prev.map(c =>
                c.id === conversation.id ? { ...c, unreadCount: 0 } : c
            )
        );

        // Charger les messages
        await fetchMessages(conversation.id);
    }, [fetchMessages]);

    // Charger les conversations
    const fetchConversations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getConversations();
            setConversations(data);

            // Sélectionner la première conversation par défaut (desktop only)
            if (data.length > 0 && window.innerWidth >= 900) {
                handleSelectConversation(data[0]);
            }
        } catch (err) {
            console.error('Erreur chargement conversations:', err);
        } finally {
            setLoading(false);
        }
    }, [handleSelectConversation]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Gérer l'indicateur de frappe
    const handleTyping = () => {
        if (!selectedConversation) return;

        if (!isTyping) {
            setIsTyping(true);
            socketService.startTyping(selectedConversation.id);
        }

        // Reset le timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socketService.stopTyping(selectedConversation.id);
        }, 2000);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || sending) return;

        // Arrêter l'indicateur de frappe
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        setIsTyping(false);
        socketService.stopTyping(selectedConversation.id);

        try {
            setSending(true);
            const sentMessage = await sendMessageApi(selectedConversation.id, newMessage);

            // Ajouter le message à la liste (le WebSocket l'enverra aux autres)
            setMessages(prev => [...prev, sentMessage]);

            // Mettre à jour la conversation dans la liste
            setConversations(prev =>
                prev.map(c =>
                    c.id === selectedConversation.id
                        ? { ...c, lastMessage: newMessage, lastMessageAt: new Date().toISOString() }
                        : c
                )
            );

            setNewMessage('');
        } catch (err) {
            console.error('Erreur envoi message:', err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

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

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const filteredConversations = conversations.filter(c =>
        c.participant?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.participant?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.itemRequested?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.itemOffered?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Empty state
    if (!loading && conversations.length === 0) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <Header activePage="messages" />
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
                        💬 Aucune conversation
                    </Typography>
                    <Typography sx={{ color: '#6B7280', mb: 4 }}>
                        Proposez un échange sur un objet pour démarrer une conversation !
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/home')}
                        sx={{
                            backgroundColor: '#22C55E',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { backgroundColor: '#16A34A' },
                        }}
                    >
                        Découvrir les objets
                    </Button>
                </Container>
                <Footer />
                <BottomNavigation />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header activePage="messages" />

            {/* Mobile View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {!selectedConversation ? (
                    // Mobile: Conversations list
                    <Box sx={{ pb: 10 }}>
                        <Box sx={{ p: 2, backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
                            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1F2937', mb: 2 }}>
                                💬 Messagerie
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: '#9CA3AF' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: '#F9FAFB',
                                    },
                                }}
                            />
                        </Box>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress sx={{ color: '#22C55E' }} />
                            </Box>
                        ) : (
                            <ConversationsList
                                conversations={filteredConversations}
                                selectedId={null}
                                onSelect={handleSelectConversation}
                                getInitials={getInitials}
                                formatTime={formatTime}
                            />
                        )}
                    </Box>
                ) : (
                    // Mobile: Chat view
                    <ChatView
                        conversation={selectedConversation}
                        conversationDetails={conversationDetails}
                        messages={messages}
                        newMessage={newMessage}
                        loadingMessages={loadingMessages}
                        sending={sending}
                        typingUser={typingUser}
                        onNewMessageChange={(value) => {
                            setNewMessage(value);
                            handleTyping();
                        }}
                        onSend={handleSendMessage}
                        onKeyPress={handleKeyPress}
                        onBack={() => {
                            if (selectedConversation) {
                                socketService.leaveConversation(selectedConversation.id);
                            }
                            setSelectedConversation(null);
                            setConversationDetails(null);
                            setMessages([]);
                        }}
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
                {/* Left: Conversations list */}
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
                        <TextField
                            fullWidth
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#9CA3AF' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#F9FAFB',
                                },
                            }}
                        />
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
                                onSelect={handleSelectConversation}
                                getInitials={getInitials}
                                formatTime={formatTime}
                            />
                        )}
                    </Box>
                </Box>

                {/* Right: Chat view */}
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
                            onNewMessageChange={(value) => {
                                setNewMessage(value);
                                handleTyping();
                            }}
                            onSend={handleSendMessage}
                            onKeyPress={handleKeyPress}
                            messagesEndRef={messagesEndRef}
                            getInitials={getInitials}
                            formatMessageTime={formatMessageTime}
                            navigate={navigate}
                        />
                    ) : (
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#9CA3AF',
                            }}
                        >
                            <Typography>Sélectionnez une conversation</Typography>
                        </Box>
                    )}
                </Box>
            </Container>

            <Footer />
            <BottomNavigation />
        </Box>
    );
};

// Conversations List Component
interface ConversationsListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (conversation: Conversation) => void;
    getInitials: (firstName: string, lastName: string) => string;
    formatTime: (dateString: string) => string;
}

const ConversationsList = ({
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

// Chat View Component
interface ChatViewProps {
    conversation: Conversation;
    conversationDetails: ConversationDetails | null;
    messages: Message[];
    newMessage: string;
    loadingMessages: boolean;
    sending: boolean;
    typingUser: string | null;
    onNewMessageChange: (value: string) => void;
    onSend: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onBack?: () => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    getInitials: (firstName: string, lastName: string) => string;
    formatMessageTime: (dateString: string) => string;
    navigate: (path: string) => void;
    isMobile?: boolean;
}

const ChatView = ({
    conversation,
    conversationDetails,
    messages,
    newMessage,
    loadingMessages,
    sending,
    typingUser,
    onNewMessageChange,
    onSend,
    onKeyPress,
    onBack,
    messagesEndRef,
    getInitials,
    formatMessageTime,
    navigate,
    isMobile,
}: ChatViewProps) => {
    const itemOffered = conversationDetails?.conversation.itemOffered;
    const itemRequested = conversationDetails?.conversation.itemRequested;
    const status = conversation.exchangeStatus ? statusConfig[conversation.exchangeStatus] : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'calc(100vh - 60px)' : '100%' }}>
            {/* Chat Header */}
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
                    ) : itemRequested ? (
                        <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                            Échange : {itemRequested.title}
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

            {/* Items Exchange Card */}
            {(itemOffered || itemRequested) && (
                <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                        {/* Item Offered */}
                        {itemOffered && (
                            <Card
                                onClick={() => navigate(`/items/${itemOffered._id}`)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    maxWidth: 200,
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ width: 50, height: 50, borderRadius: '8px', objectFit: 'cover' }}
                                    image={itemOffered.images?.[0] || 'https://placehold.co/50x50/E5E7EB/9CA3AF?text=📷'}
                                    alt={itemOffered.title}
                                />
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '11px', color: '#6B7280' }}>Proposé</Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#1F2937',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {itemOffered.title}
                                    </Typography>
                                </Box>
                            </Card>
                        )}

                        {/* Swap Icon */}
                        {itemOffered && itemRequested && (
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: '#22C55E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <SwapHoriz sx={{ color: '#fff', fontSize: 20 }} />
                            </Box>
                        )}

                        {/* Item Requested */}
                        {itemRequested && (
                            <Card
                                onClick={() => navigate(`/items/${itemRequested._id}`)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1.5,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    flex: 1,
                                    maxWidth: 200,
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ width: 50, height: 50, borderRadius: '8px', objectFit: 'cover' }}
                                    image={itemRequested.images?.[0] || 'https://placehold.co/50x50/E5E7EB/9CA3AF?text=📷'}
                                    alt={itemRequested.title}
                                />
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '11px', color: '#6B7280' }}>Demandé</Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#1F2937',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {itemRequested.title}
                                    </Typography>
                                </Box>
                            </Card>
                        )}
                    </Box>
                </Box>
            )}

            {/* Messages */}
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
                {loadingMessages ? (
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

            {/* Input */}
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
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
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
                    disabled={!newMessage.trim() || sending}
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
        </Box>
    );
};

export default MessagesPage;