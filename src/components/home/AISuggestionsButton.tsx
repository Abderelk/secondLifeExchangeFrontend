// src/components/home/AISuggestionsButton.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Fab,
    Drawer,
    Typography,
    Button,
    Chip,
    IconButton,
    Card,
    CardMedia,
    Skeleton,
    Badge,
} from '@mui/material';
import {
    AutoAwesome,
    Close,
    Lightbulb,
    Favorite,
    FavoriteBorder,
    ArrowForward,
    Refresh,
    Add,
} from '@mui/icons-material';
import {
    getPersonalizedSuggestions,
    type AISuggestionsResponse,
    type RecommendedItem,
} from '../../services/suggestionsService';
import { toggleLike } from '../../services/itemService';

export const AISuggestionsButton = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<AISuggestionsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNewSuggestions, setHasNewSuggestions] = useState(true);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPersonalizedSuggestions();
            setSuggestions(data);
            setHasNewSuggestions(false);
        } catch (err) {
            console.error('Erreur suggestions IA:', err);
            setError('Impossible de charger les suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        if (!suggestions && !loading) {
            fetchSuggestions();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const handleRefresh = () => {
        fetchSuggestions();
    };

    const handlePropose = () => {
        setOpen(false);
        navigate('/add-item');
    };

    const handleSuggestionClick = (suggestion: string) => {
        setOpen(false);
        // Naviguer vers add-item avec la suggestion pré-remplie
        navigate('/add-item', { state: { suggestion } });
    };

    const handleCategoryClick = (category: string) => {
        setOpen(false);
        // Naviguer vers home avec filtre catégorie
        navigate(`/home?category=${encodeURIComponent(category)}`);
    };

    const handleItemClick = (itemId: string) => {
        setOpen(false);
        navigate(`/items/${itemId}`);
    };

    const handleViewMore = () => {
        setOpen(false);
        navigate('/home');
    };

    return (
        <>
            {/* Bouton flottant IA */}
            <Fab
                onClick={handleOpen}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 150, md: 100 },
                    right: { xs: 16, md: 32 },
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                    color: '#FFFFFF',
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                    },
                    zIndex: 998,
                }}
            >
                <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasNewSuggestions}
                    sx={{
                        '& .MuiBadge-dot': {
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                        },
                    }}
                >
                    <AutoAwesome sx={{ fontSize: { xs: 26, md: 30 } }} />
                </Badge>
            </Fab>

            {/* Drawer avec suggestions */}
            <Drawer
                anchor="bottom"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        maxHeight: '85vh',
                        backgroundColor: '#FAFAFA',
                    },
                }}
            >
                {/* Header du drawer */}
                <Box
                    sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesome />
                        <Typography fontWeight={700} fontSize="18px">
                            Suggestions IA
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={handleRefresh} sx={{ color: '#FFFFFF' }} disabled={loading}>
                            <Refresh />
                        </IconButton>
                        <IconButton onClick={handleClose} sx={{ color: '#FFFFFF' }}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                {/* Contenu */}
                <Box sx={{ p: 2.5, pb: 4, overflowY: 'auto' }}>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState onRetry={handleRefresh} />
                    ) : suggestions ? (
                        <>
                            {/* Greeting */}
                            <Typography
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#1F2937',
                                    mb: 3,
                                }}
                            >
                                {suggestions.greeting}
                            </Typography>

                            {/* Suggestions à proposer */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Lightbulb sx={{ fontSize: 20, color: '#F59E0B' }} />
                                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1F2937' }}>
                                        {suggestions.context.weeklyThemeEmoji} {suggestions.reasonToPropose}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {suggestions.suggestionsToPropose.map((suggestion, index) => (
                                        <Card
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                borderRadius: '12px',
                                                border: '1px solid #E5E7EB',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: '#8B5CF6',
                                                    backgroundColor: '#F5F3FF',
                                                    transform: 'translateX(4px)',
                                                },
                                                '&:active': {
                                                    transform: 'scale(0.98)',
                                                },
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                                                {suggestion}
                                            </Typography>
                                            <Add sx={{ color: '#8B5CF6', fontSize: 20 }} />
                                        </Card>
                                    ))}
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<Add />}
                                    onClick={handlePropose}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        backgroundColor: '#22C55E',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        fontSize: '15px',
                                        '&:hover': { backgroundColor: '#16A34A' },
                                        '&:active': { transform: 'scale(0.98)' },
                                    }}
                                >
                                    Proposer un objet
                                </Button>
                            </Box>

                            {/* Catégories recommandées */}
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1F2937', mb: 1.5 }}>
                                    🎯 Catégories pour toi
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {suggestions.recommendedCategories.map((category, index) => (
                                        <Chip
                                            key={index}
                                            label={category}
                                            onClick={() => handleCategoryClick(category)}
                                            sx={{
                                                backgroundColor: '#F3E8FF',
                                                color: '#7C3AED',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#8B5CF6',
                                                    color: '#FFFFFF',
                                                },
                                                '&:active': {
                                                    transform: 'scale(0.95)',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                                <Typography sx={{ fontSize: '12px', color: '#6B7280', mt: 1 }}>
                                    {suggestions.reasonForRecommendation}
                                </Typography>
                            </Box>

                            {/* Objets recommandés */}
                            {suggestions.recommendedItems.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1F2937' }}>
                                            ❤️ Recommandés pour toi
                                        </Typography>
                                        <Button
                                            endIcon={<ArrowForward />}
                                            onClick={handleViewMore}
                                            sx={{
                                                color: '#8B5CF6',
                                                textTransform: 'none',
                                                fontSize: '13px',
                                                '&:active': { transform: 'scale(0.95)' },
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
                                            mx: -0.5,
                                            px: 0.5,
                                            '&::-webkit-scrollbar': { height: 6 },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#D1D5DB',
                                                borderRadius: 3,
                                            },
                                        }}
                                    >
                                        {suggestions.recommendedItems.map((item) => (
                                            <RecommendedItemCard
                                                key={item.id}
                                                item={item}
                                                onLike={handleLike}
                                                onClick={() => handleItemClick(item.id)}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Tip */}
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: '#F0FDF4',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #22C55E',
                                }}
                            >
                                <Typography sx={{ fontSize: '14px', color: '#166534' }}>
                                    {suggestions.tip}
                                </Typography>
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Drawer>
        </>
    );
};

// Composant carte item recommandé
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
                minWidth: 140,
                maxWidth: 140,
                borderRadius: '12px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
                '&:active': {
                    transform: 'scale(0.98)',
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
                        '&:active': { transform: 'scale(0.9)' },
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

// Loading skeleton
const LoadingSkeleton = () => (
    <Box>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={56} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={48} sx={{ mb: 4 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={140} height={160} />
            <Skeleton variant="rounded" width={140} height={160} />
        </Box>
    </Box>
);

// Error state
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" gutterBottom>
            Une erreur est survenue
        </Typography>
        <Button
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{ color: '#8B5CF6' }}
        >
            Réessayer
        </Button>
    </Box>
);

export default AISuggestionsButton;