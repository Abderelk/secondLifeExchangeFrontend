// src/pages/ExchangesPage.tsx

import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { SwapHoriz, Inbox, Send } from '@mui/icons-material';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ExchangeRequestCard } from '../components/exchange/ExchangeRequestCard';
import {
    getMyExchanges,
    respondToExchange,
    completeExchange,
    cancelExchange,
    type Exchange,
} from '../services/exchangeService';
import { useAuth } from '../context/AuthContext';

type TabValue = 'all' | 'received' | 'sent';

export const ExchangesPage = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState<TabValue>('all');
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [, setActionLoading] = useState<string | null>(null);

    const fetchExchanges = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyExchanges(tab);
            setExchanges(data);
        } catch (err) {
            setError('Impossible de charger vos échanges');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => {
        fetchExchanges();
    }, [fetchExchanges]);

    const handleAccept = async (id: string) => {
        try {
            setActionLoading(id);
            await respondToExchange(id, { action: 'accept' });
            await fetchExchanges();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        try {
            setActionLoading(id);
            await respondToExchange(id, { action: 'reject' });
            await fetchExchanges();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (id: string) => {
        try {
            setActionLoading(id);
            await completeExchange(id);
            await fetchExchanges();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            setActionLoading(id);
            await cancelExchange(id);
            await fetchExchanges();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const pendingReceived = exchanges.filter(
        (e) => e.status === 'pending' && e.owner._id === user?._id
    ).length;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header activePage="exchanges" />

            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
                {/* Header */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color="#1F2937"
                        gutterBottom
                        sx={{ fontSize: { xs: '24px', md: '34px' } }}
                    >
                        Mes échanges
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: { xs: '14px', md: '16px' } }}>
                        Gérez vos propositions d'échange envoyées et reçues
                    </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Tabs
                        value={tab}
                        onChange={(_, newValue) => setTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#22C55E',
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: { xs: '13px', md: '15px' },
                                minWidth: { xs: 'auto', md: 120 },
                                px: { xs: 1.5, md: 2 },
                                '&.Mui-selected': {
                                    color: '#22C55E',
                                },
                            },
                        }}
                    >
                        <Tab
                            value="all"
                            label="Tous"
                            icon={<SwapHoriz />}
                            iconPosition="start"
                        />
                        <Tab
                            value="received"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Reçus
                                    {pendingReceived > 0 && (
                                        <Box
                                            sx={{
                                                backgroundColor: '#EF4444',
                                                color: '#fff',
                                                borderRadius: '10px',
                                                px: 1,
                                                py: 0.25,
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {pendingReceived}
                                        </Box>
                                    )}
                                </Box>
                            }
                            icon={<Inbox />}
                            iconPosition="start"
                        />
                        <Tab
                            value="sent"
                            label="Envoyés"
                            icon={<Send />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#22C55E' }} />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : exchanges.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: { xs: 6, md: 8 },
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #E5E7EB',
                            px: 2,
                        }}
                    >
                        <SwapHoriz sx={{ fontSize: { xs: 48, md: 64 }, color: '#D1D5DB', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '16px', md: '20px' } }}>
                            Aucun échange pour le moment
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, fontSize: { xs: '13px', md: '16px' } }}>
                            {tab === 'sent'
                                ? "Vous n'avez pas encore proposé d'échange"
                                : tab === 'received'
                                    ? "Vous n'avez pas reçu de proposition"
                                    : "Commencez par proposer un échange sur un objet qui vous plaît !"}
                        </Typography>
                        <Button
                            variant="contained"
                            href="/home"
                            sx={{
                                backgroundColor: '#22C55E',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                '&:hover': { backgroundColor: '#16A34A' },
                            }}
                        >
                            Découvrir les objets
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, pb: { xs: 10, md: 0 } }}>
                        {exchanges.map((exchange) => (
                            <ExchangeRequestCard
                                key={exchange._id}
                                exchange={exchange}
                                currentUserId={user?._id || ''}
                                onAccept={handleAccept}
                                onReject={handleReject}
                                onComplete={handleComplete}
                                onCancel={handleCancel}
                            />
                        ))}
                    </Box>
                )}
            </Container>

            <Footer />

            {/* Bottom Navigation pour mobile */}
            <BottomNavigation />
        </Box>
    );
};

export default ExchangesPage;