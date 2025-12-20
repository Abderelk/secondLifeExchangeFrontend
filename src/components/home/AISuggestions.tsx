// src/components/home/AISuggestions.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    Typography,
    Button,
    Chip,
    Skeleton,
    CardMedia,
    IconButton,
} from '@mui/material';
import {
    AutoAwesome,
    Lightbulb,
    Favorite,
    FavoriteBorder,
    ArrowForward,
    Refresh,
} from '@mui/icons-material';
import {
    getPersonalizedSuggestions,
    type AISuggestionsResponse,
    type RecommendedItem,
} from '../../services/suggestionsService';
import { toggleLike } from '../../services/itemService';

export const AISuggestions = () => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState<AISuggestionsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPersonalizedSuggestions();
            setSuggestions(data);
        } catch (err) {
            console.error('Erreur suggestions IA:', err);
            setError('Impossible de charger les suggestions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleLike = async (itemId: string) => {
        try {
            const result = await toggleLike(itemId);
            setSuggestions((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    recommendedItems: prev.recommendedItems.map((item) =>
                        item.id === itemId
                            ? { ...item, isLiked: result.isLiked, likes: result.likesCount }
                            : item
                    ),
                };
            });
        } catch (err) {
            console.error('Erreur like:', err);
        }
    };

    if (loading) {
        return (
            <Card
                sx={{
                    p: 3,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    border: '1px solid #BBF7D0',
                }}
            >
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mt: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rounded" width={100} height={32} />
                    <Skeleton variant="rounded" width={120} height={32} />
                    <Skeleton variant="rounded" width={90} height={32} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Skeleton variant="rounded" width={150} height={180} />
                    <Skeleton variant="rounded" width={150} height={180} />
                </Box>
            </Card>
        );
    }

    if (error || !suggestions) {
        return (
            <Card
                sx={{
                    p: 3,
                    borderRadius: '20px',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    textAlign: 'center',
                }}
            >
                <Typography color="error" gutterBottom>
                    {error || 'Une erreur est survenue'}
                </Typography>
                <Button
                    startIcon={<Refresh />}
                    onClick={fetchSuggestions}
                    sx={{ color: '#22C55E' }}
                >
                    Réessayer
                </Button>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                border: '1px solid #BBF7D0',
                position: 'relative',
                overflow: 'visible',
            }}
        >
            {/* Badge IA */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -12,
                    left: 20,
                    backgroundColor: '#22C55E',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                }}
            >
                <AutoAwesome sx={{ fontSize: 16 }} />
                Suggestions IA
            </Box>

            {/* Bouton refresh */}
            <IconButton
                onClick={fetchSuggestions}
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: '#fff' },
                }}
                size="small"
            >
                <Refresh sx={{ fontSize: 18, color: '#22C55E' }} />
            </IconButton>

            {/* Greeting */}
            <Typography
                sx={{
                    fontSize: { xs: '18px', md: '20px' },
                    fontWeight: 700,
                    color: '#166534',
                    mt: 1,
                    mb: 2,
                }}
            >
                {suggestions.greeting}
            </Typography>

            {/* Suggestions à proposer */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Lightbulb sx={{ fontSize: 20, color: '#F59E0B' }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
                        {suggestions.context.weeklyThemeEmoji} {suggestions.reasonToPropose}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {suggestions.suggestionsToPropose.map((suggestion, index) => (
                        <Chip
                            key={index}
                            label={suggestion}
                            onClick={() => navigate('/add-item')}
                            sx={{
                                backgroundColor: '#fff',
                                border: '1px solid #D1FAE5',
                                color: '#166534',
                                fontWeight: 500,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#DCFCE7',
                                    borderColor: '#22C55E',
                                },
                            }}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate('/add-item')}
                    sx={{
                        mt: 2,
                        backgroundColor: '#22C55E',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#16A34A' },
                    }}
                >
                    Proposer un objet
                </Button>
            </Box>

            {/* Objets recommandés */}
            {suggestions.recommendedItems.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
                                ❤️ Recommandés pour toi
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                                {suggestions.reasonForRecommendation}
                            </Typography>
                        </Box>
                        <Button
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/home')}
                            sx={{
                                color: '#22C55E',
                                textTransform: 'none',
                                fontSize: '13px',
                            }}
                        >
                            Voir plus
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            overflowX: 'auto',
                            pb: 1,
                            mx: -1,
                            px: 1,
                            '&::-webkit-scrollbar': { height: 6 },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#D1D5DB',
                                borderRadius: 3,
                            },
                        }}
                    >
                        {suggestions.recommendedItems.slice(0, 4).map((item) => (
                            <RecommendedItemCard
                                key={item.id}
                                item={item}
                                onLike={handleLike}
                                onClick={() => navigate(`/items/${item.id}`)}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Tip */}
            <Box
                sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '12px',
                    borderLeft: '4px solid #22C55E',
                }}
            >
                <Typography sx={{ fontSize: '13px', color: '#166534' }}>
                    {suggestions.tip}
                </Typography>
            </Box>
        </Card>
    );
};

// Composant pour une carte d'item recommandé
interface RecommendedItemCardProps {
    item: RecommendedItem;
    onLike: (id: string) => void;
    onClick: () => void;
}

const RecommendedItemCard = ({ item, onLike, onClick }: RecommendedItemCardProps) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                minWidth: 150,
                maxWidth: 150,
                borderRadius: '12px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="100"
                    image={item.image}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                />
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(item.id);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        '&:hover': { backgroundColor: '#fff' },
                    }}
                >
                    {item.isLiked ? (
                        <Favorite sx={{ fontSize: 16, color: '#EF4444' }} />
                    ) : (
                        <FavoriteBorder sx={{ fontSize: 16, color: '#6B7280' }} />
                    )}
                </IconButton>
            </Box>
            <Box sx={{ p: 1.5 }}>
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
                    {item.title}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#6B7280' }}>
                    {item.ownerName}
                </Typography>
            </Box>
        </Card>
    );
};

export default AISuggestions;