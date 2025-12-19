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
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#1F2937', mb: 4 }}>
                {title}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
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