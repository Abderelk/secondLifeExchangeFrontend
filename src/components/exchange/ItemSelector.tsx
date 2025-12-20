// src/components/exchange/ItemSelector.tsx

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { getMyItemsForExchange, type ExchangeItem } from '../../services/exchangeService';

interface ItemSelectorProps {
  selectedItems: string[];
  onSelectionChange: (itemIds: string[]) => void;
  maxSelection?: number;
}

export const ItemSelector = ({
  selectedItems,
  onSelectionChange,
  maxSelection = 5,
}: ItemSelectorProps) => {
  const [items, setItems] = useState<ExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getMyItemsForExchange();
        setItems(data);
      } catch (err) {
        setError('Impossible de charger vos objets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else if (selectedItems.length < maxSelection) {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#22C55E' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (items.length === 0) {
    return (
      <Alert severity="info">
        Vous n'avez pas encore d'objets à proposer. Ajoutez des objets pour pouvoir faire des échanges !
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Sélectionnez les objets à proposer en échange
        </Typography>
        <Chip
          label={`${selectedItems.length}/${maxSelection} sélectionnés`}
          size="small"
          color={selectedItems.length > 0 ? 'success' : 'default'}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 2,
        }}
      >
        {items.map((item) => {
          const isSelected = selectedItems.includes(item._id);
          const isDisabled = !isSelected && selectedItems.length >= maxSelection;

          return (
            <Card
              key={item._id}
              onClick={() => !isDisabled && handleToggle(item._id)}
              sx={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                position: 'relative',
                borderRadius: '12px',
                border: isSelected ? '2px solid #22C55E' : '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: isDisabled ? 'none' : 'scale(1.02)',
                  boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            >
              {/* Checkbox overlay */}
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    backgroundColor: '#22C55E',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
              )}

              <CardMedia
                component="img"
                height="120"
                image={item.images[0] || 'https://via.placeholder.com/150?text=No+Image'}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />

              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1F2937',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </Typography>
                {item.category && (
                  <Typography sx={{ fontSize: '11px', color: '#6B7280' }}>
                    {item.category}
                  </Typography>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default ItemSelector;