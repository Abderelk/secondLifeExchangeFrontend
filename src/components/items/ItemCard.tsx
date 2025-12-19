// src/components/items/ItemCard.tsx

import { Box, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { FavoriteBorder, Favorite, SwapHoriz } from '@mui/icons-material';

export interface Item {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  ownerName: string;
  location: string;
  likes: number;
  isLiked: boolean;
}

interface ItemCardProps {
  item: Item;
  onLike?: (itemId: string) => void;
  onExchange?: (itemId: string) => void;
}

export const ItemCard = ({ item, onLike, onExchange }: ItemCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E5E7EB',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt={item.title}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: '#22C55E',
            color: '#FFFFFF',
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {item.category}
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937', mb: 0.5 }}>
          {item.title}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 2 }}>
          {item.description}
        </Typography>

        {/* Owner info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
            {item.ownerName}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#9CA3AF' }}>
            {item.location}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={item.isLiked ? <Favorite sx={{ color: '#EF4444' }} /> : <FavoriteBorder />}
            onClick={() => onLike?.(item.id)}
            sx={{
              borderColor: '#E5E7EB',
              color: item.isLiked ? '#EF4444' : '#6B7280',
              textTransform: 'none',
              borderRadius: '8px',
              minWidth: 'auto',
              px: 2,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              },
            }}
          >
            {item.likes}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<SwapHoriz />}
            fullWidth
            onClick={() => onExchange?.(item.id)}
            sx={{
              backgroundColor: '#22C55E',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#16A34A',
                boxShadow: 'none',
              },
            }}
          >
            Proposer un échange
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemCard;