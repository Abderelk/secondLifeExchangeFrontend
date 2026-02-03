import {
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { SwapHoriz, CheckCircle, Cancel } from '@mui/icons-material';

interface ExchangeItem {
  _id: string;
  title: string;
  images?: string[];
}

interface ExchangeItemsCardProps {
  itemOffered?: ExchangeItem | null;
  itemRequested?: ExchangeItem | null;
  isOwner: boolean;
  exchangeStatus: string;
  exchangeLoading: boolean;
  onAcceptExchange: () => void;
  onRejectExchange: () => void;
  onNavigate: (path: string) => void;
}

export const ExchangeItemsCard = ({
  itemOffered,
  itemRequested,
  isOwner,
  exchangeStatus,
  exchangeLoading,
  onAcceptExchange,
  onRejectExchange,
  onNavigate,
}: ExchangeItemsCardProps) => {
  if (!itemOffered && !itemRequested) return null;

  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
        {itemOffered && (
          <Card
            onClick={() => onNavigate(`/items/${itemOffered._id}`)}
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

        {itemRequested && (
          <Card
            onClick={() => onNavigate(`/items/${itemRequested._id}`)}
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

      {isOwner && exchangeStatus === 'pending' && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={onAcceptExchange}
            disabled={exchangeLoading}
            startIcon={exchangeLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckCircle />}
            sx={{
              backgroundColor: '#22C55E',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 3,
              '&:hover': { backgroundColor: '#16A34A' },
            }}
          >
            Accepter
          </Button>
          <Button
            variant="outlined"
            onClick={onRejectExchange}
            disabled={exchangeLoading}
            startIcon={exchangeLoading ? <CircularProgress size={16} /> : <Cancel />}
            sx={{
              borderColor: '#EF4444',
              color: '#EF4444',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                borderColor: '#DC2626',
                backgroundColor: '#FEF2F2',
              },
            }}
          >
            Refuser
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ExchangeItemsCard;
