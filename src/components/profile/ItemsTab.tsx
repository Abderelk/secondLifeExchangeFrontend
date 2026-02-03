import { Box, Card, CardMedia, Typography, Chip, Button } from '@mui/material';
import { Inventory2 } from '@mui/icons-material';

interface UserItem {
  id: string;
  title: string;
  image: string;
  category: string;
  status: 'available' | 'pending' | 'exchanged';
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  available: { label: 'Disponible', color: '#16A34A', bgColor: '#DCFCE7' },
  pending: { label: 'En échange', color: '#EA580C', bgColor: '#FED7AA' },
  exchanged: { label: 'Échangé', color: '#6B7280', bgColor: '#F3F4F6' },
};

interface ItemsTabProps {
  items: UserItem[];
  onManageItem: (itemId: string) => void;
  onAddItem: () => void;
}

export const ItemsTab = ({ items, onManageItem, onAddItem }: ItemsTabProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
      gap: 2.5,
    }}
  >
    {items.map((item) => {
      const status = statusConfig[item.status] || statusConfig.available;

      return (
        <Card key={item.id} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="160"
            image={item.image}
            alt={item.title}
            sx={{ objectFit: 'cover' }}
          />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#1F2937', flex: 1 }}>
                {item.title}
              </Typography>
              <Chip
                label={status.label}
                size="small"
                sx={{
                  backgroundColor: status.bgColor,
                  color: status.color,
                  fontWeight: 600,
                  fontSize: '11px',
                  height: 24,
                }}
              />
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#6B7280', mb: 2 }}>
              {item.category}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onManageItem(item.id)}
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Gérer
            </Button>
          </Box>
        </Card>
      );
    })}

    {/* Carte Ajouter */}
    <Card
      onClick={onAddItem}
      sx={{
        borderRadius: '12px',
        border: '2px dashed #D1D5DB',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 280,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: 'none',
        '&:hover': {
          borderColor: '#22C55E',
          backgroundColor: '#F0FDF4',
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '12px',
          backgroundColor: '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Inventory2 sx={{ fontSize: 28, color: '#9CA3AF' }} />
      </Box>
      <Typography sx={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
        Ajouter un nouvel objet
      </Typography>
    </Card>
  </Box>
);

export default ItemsTab;
