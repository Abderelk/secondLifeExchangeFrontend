// src/components/exchange/ExchangeRequestCard.tsx

import {
    Box,
    Card,
    CardMedia,
    Typography,
    Button,
    Chip,
    Avatar,
} from '@mui/material';
import {
    SwapHoriz,
    AccessTime,
    CheckCircle,
    Cancel,
    HourglassEmpty,
} from '@mui/icons-material';
import type { Exchange } from '../../services/exchangeService';

interface ExchangeRequestCardProps {
    exchange: Exchange;
    currentUserId: string;
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onCancel?: (id: string) => void;
    onComplete?: (id: string) => void;
    onClick?: (id: string) => void;
}

const statusConfig = {
    pending: { label: 'En attente', color: '#F59E0B', icon: <HourglassEmpty /> },
    accepted: { label: 'Accepté', color: '#22C55E', icon: <CheckCircle /> },
    rejected: { label: 'Refusé', color: '#EF4444', icon: <Cancel /> },
    cancelled: { label: 'Annulé', color: '#6B7280', icon: <Cancel /> },
    completed: { label: 'Terminé', color: '#3B82F6', icon: <CheckCircle /> },
};

export const ExchangeRequestCard = ({
    exchange,
    currentUserId,
    onAccept,
    onReject,
    onCancel,
    onComplete,
    onClick,
}: ExchangeRequestCardProps) => {
    const isRequester = exchange.requester._id === currentUserId;
    const isOwner = exchange.owner._id === currentUserId;
    const status = statusConfig[exchange.status];

    const otherUser = isRequester ? exchange.owner : exchange.requester;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Card
            onClick={() => onClick?.(exchange._id)}
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #E5E7EB',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onClick
                    ? {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    }
                    : {},
            }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={otherUser.avatar}
                            sx={{ width: 44, height: 44, backgroundColor: '#22C55E' }}
                        >
                            {otherUser.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 600, color: '#1F2937' }}>
                                {otherUser.firstName} {otherUser.lastName?.charAt(0)}.
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTime sx={{ fontSize: 14 }} />
                                {formatDate(exchange.createdAt)}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={status.icon}
                        label={status.label}
                        size="small"
                        sx={{
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: status.color },
                        }}
                    />
                </Box>

                {/* Items échangés */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    {/* Item demandé */}
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '12px', color: '#6B7280', mb: 1 }}>
                            {isRequester ? 'Vous voulez' : 'Votre objet'}
                        </Typography>
                        <CardMedia
                            component="img"
                            image={exchange.requestedItem.images?.[0] || 'https://via.placeholder.com/100'}
                            alt={exchange.requestedItem.title}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '12px',
                                objectFit: 'cover',
                                mx: 'auto',
                                mb: 1,
                            }}
                        />
                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1F2937' }}>
                            {exchange.requestedItem.title}
                        </Typography>
                    </Box>

                    {/* Icône échange */}
                    <SwapHoriz sx={{ fontSize: 32, color: '#22C55E' }} />

                    {/* Items offerts */}
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '12px', color: '#6B7280', mb: 1 }}>
                            {isRequester ? 'Vous proposez' : 'En échange de'}
                        </Typography>
                        {exchange.offeredItems.length > 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                {exchange.offeredItems.slice(0, 3).map((item) => (
                                    <CardMedia
                                        key={item._id}
                                        component="img"
                                        image={item.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={item.title}
                                        sx={{
                                            width: exchange.offeredItems.length === 1 ? 80 : 50,
                                            height: exchange.offeredItems.length === 1 ? 80 : 50,
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ))}
                                {exchange.offeredItems.length > 3 && (
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '8px',
                                            backgroundColor: '#F3F4F6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                                            +{exchange.offeredItems.length - 3}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '12px',
                                    backgroundColor: '#F3F4F6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                }}
                            >
                                <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>
                                    Aucun objet
                                </Typography>
                            </Box>
                        )}
                        {exchange.offeredItems.length === 1 && (
                            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1F2937', mt: 1 }}>
                                {exchange.offeredItems[0].title}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Message */}
                {exchange.message && (
                    <Box
                        sx={{
                            backgroundColor: '#F9FAFB',
                            borderRadius: '8px',
                            p: 2,
                            mb: 3,
                        }}
                    >
                        <Typography sx={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic' }}>
                            "{exchange.message}"
                        </Typography>
                    </Box>
                )}

                {/* Actions */}
                {exchange.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isOwner && (
                            <>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccept?.(exchange._id);
                                    }}
                                    sx={{
                                        backgroundColor: '#22C55E',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        '&:hover': { backgroundColor: '#16A34A' },
                                    }}
                                >
                                    Accepter
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onReject?.(exchange._id);
                                    }}
                                    sx={{
                                        borderColor: '#E5E7EB',
                                        color: '#6B7280',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: '8px',
                                        '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
                                    }}
                                >
                                    Refuser
                                </Button>
                            </>
                        )}
                        {isRequester && (
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancel?.(exchange._id);
                                }}
                                sx={{
                                    borderColor: '#E5E7EB',
                                    color: '#6B7280',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
                                }}
                            >
                                Annuler ma demande
                            </Button>
                        )}
                    </Box>
                )}

                {exchange.status === 'accepted' && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={(e) => {
                                e.stopPropagation();
                                onComplete?.(exchange._id);
                            }}
                            sx={{
                                backgroundColor: '#3B82F6',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                '&:hover': { backgroundColor: '#2563EB' },
                            }}
                        >
                            Confirmer l'échange terminé
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel?.(exchange._id);
                            }}
                            sx={{
                                borderColor: '#E5E7EB',
                                color: '#6B7280',
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '8px',
                                '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
                            }}
                        >
                            Annuler
                        </Button>
                    </Box>
                )}
            </Box>
        </Card>
    );
};

export default ExchangeRequestCard;