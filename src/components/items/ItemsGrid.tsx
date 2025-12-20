// src/components/items/ItemsGrid.tsx

import { Box, Container, Typography } from '@mui/material';
import { ItemCard, type Item } from './ItemCard';

interface ItemsGridProps {
  title: string;
  items: Item[];
  onLike?: (itemId: string) => void;
  onExchange?: (itemId: string) => void;
}

export const ItemsGrid = ({ title, items, onLike, onExchange }: ItemsGridProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
      <Typography 
        sx={{ 
          fontSize: { xs: '20px', md: '24px' }, 
          fontWeight: 700, 
          color: '#1F2937', 
          mb: { xs: 3, md: 4 } 
        }}
      >
        {title}
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: { xs: 2, md: 3 } 
        }}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onLike={onLike}
            onExchange={onExchange}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ItemsGrid;