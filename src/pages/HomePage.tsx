// src/pages/HomePage.tsx

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, FavoriteBorder, ChatBubbleOutline } from '@mui/icons-material';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { WeeklyThemeBanner, type WeeklyTheme } from '../components/home/WeeklyThemeBanner';
import { StatsSection, type StatItem } from '../components/home/StatsSection';
import { ItemsGrid } from '../components/items/ItemsGrid';
import { type Item } from '../components/items/ItemCard';
import { getHomeData } from '../services/homeService';
import { toggleLike } from '../services/itemService';

// Données par défaut en cas d'erreur
const defaultWeeklyTheme: WeeklyTheme = {
    title: "Vêtements d'hiver",
    emoji: "🧥",
    dateRange: "Cette semaine",
    description: "Échangez vos vêtements d'hiver : manteaux, écharpes, pulls...",
};

const defaultStats: StatItem[] = [
    {
        icon: <TrendingUp />,
        title: "Impact Environnemental",
        value: "0",
        subtitle: "objets échangés ce mois-ci",
        color: "#22C55E",
    },
    {
        icon: <FavoriteBorder />,
        title: "Communauté Active",
        value: "0",
        subtitle: "membres engagés",
        color: "#22C55E",
    },
    {
        icon: <ChatBubbleOutline />,
        title: "Échanges en Cours",
        value: "0",
        subtitle: "conversations actives",
        color: "#1F2937",
    },
];

// Mapper les icônes depuis les strings du backend
const iconMap: Record<string, React.ReactNode> = {
    TrendingUp: <TrendingUp />,
    FavoriteBorder: <FavoriteBorder />,
    ChatBubbleOutline: <ChatBubbleOutline />,
};

export const HomePage = () => {
    const [weeklyTheme, setWeeklyTheme] = useState<WeeklyTheme>(defaultWeeklyTheme);
    const [stats, setStats] = useState<StatItem[]>(defaultStats);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Charger les données au montage
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getHomeData();

                // Mettre à jour le thème
                if (data.weeklyTheme) {
                    setWeeklyTheme(data.weeklyTheme);
                }

                // Mettre à jour les stats avec les icônes React
                if (data.stats) {
                    const statsWithIcons = data.stats.map((stat) => ({
                        ...stat,
                        icon: iconMap[stat.icon as unknown as string] || <TrendingUp />,
                    }));
                    setStats(statsWithIcons);
                }

                // Mettre à jour les items
                if (data.items) {
                    setItems(data.items);
                }
            } catch (err) {
                console.error('Erreur chargement données:', err);
                setError('Impossible de charger les données. Veuillez réessayer.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Gérer le like
    const handleLike = async (itemId: string) => {
        try {
            const result = await toggleLike(itemId);

            setItems(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, isLiked: result.isLiked, likes: result.likesCount }
                        : item
                )
            );
        } catch (err) {
            console.error('Erreur like:', err);
            // Fallback: toggle local
            setItems(prev =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
                        : item
                )
            );
        }
    };

    // Gérer la proposition d'échange
    const handleExchange = (itemId: string) => {
        console.log('Échange proposé pour:', itemId);
    };

    // Affichage loading
    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <Header activePage="home" />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh',
                    }}
                >
                    <CircularProgress sx={{ color: '#22C55E' }} />
                </Box>
                <Footer />
                <BottomNavigation />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header activePage="home" />

            {error && (
                <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mt: 2 }}>
                    {error}
                </Alert>
            )}

            <WeeklyThemeBanner theme={weeklyTheme} />

            <StatsSection stats={stats} />

            <ItemsGrid
                title="Objets disponibles cette semaine"
                items={items}
                onLike={handleLike}
                onExchange={handleExchange}
            />

            <Footer />

            {/* Bottom Navigation pour mobile */}
            <BottomNavigation />
        </Box>
    );
};

export default HomePage;