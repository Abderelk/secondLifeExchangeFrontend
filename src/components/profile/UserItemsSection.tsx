// src/components/profile/UserItemsSection.tsx

import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardMedia, Chip, IconButton } from '@mui/material';
import { Edit, Delete, Visibility, Favorite } from '@mui/icons-material';

export interface UserItem {
  id: string;
  title: string;
  image: string;
  category: string;
  status: 'available' | 'pending' | 'exchanged' | 'removed';
  likes: number;
  views: number;
  createdAt: string;
}

interface UserItemsSectionProps {
  items: UserItem[];
  isOwnProfile?: boolean;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
}

const statusConfig = {
  available: { label: 'Disponible', color: '#22C55E' },
  pending: { label: 'En cours', color: '#F59E0B' },
  exchanged: { label: 'Échangé', color: '#3B82F6' },
  removed: { label: 'Retiré', color: '#6B7280' },
};

type TabValue = 'all' | 'available' | 'exchanged';

export const UserItemsSection = ({
  items,
  isOwnProfile = true,
  onEdit,
  onDelete,
  onItemClick,
}: UserItemsSectionProps) => {
  const [tab, setTab] = useState<TabValue>('all');

  const filteredItems = items.filter((item) => {
    if (tab === 'all') return true;
    if (tab === 'available') return item.status === 'available' || item.status === 'pending';
    if (tab === 'exchanged') return item.status === 'exchanged';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontSize: { xs: '18px', md: '20px' }, fontWeight: 700, color: '#1F2937' }}>
          {isOwnProfile ? 'Mes objets' : 'Ses objets'}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#6B7280' }}>
          {items.length} objet{items.length > 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': { backgroundColor: '#22C55E' },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            '&.Mui-selected': { color: '#22C55E' },
          },
        }}
      >
        <Tab value="all" label="Tous" />
        <Tab value="available" label="Disponibles" />
        <Tab value="exchanged" label="Échangés" />
      </Tabs>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
          }}
        >
          <Typography color="text.secondary">
            {tab === 'all'
              ? "Aucun objet publié"
              : tab === 'available'
              ? "Aucun objet disponible"
              : "Aucun échange réalisé"}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {filteredItems.map((item) => {
            const status = statusConfig[item.status];

            return (
              <Card
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image || 'https://via.placeholder.com/200?text=No+Image'}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label={status.label}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: status.color,
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '11px',
                    }}
                  />

                  {/* Actions pour le propriétaire */}
                  {isOwnProfile && item.status === 'available' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(item.id);
                        }}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: '#FFFFFF' },
                        }}
                      >
                        <Edit sx={{ fontSize: 16, color: '#6B7280' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(item.id);
                        }}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': { backgroundColor: '#FFFFFF' },
                        }}
                      >
                        <Delete sx={{ fontSize: 16, color: '#EF4444' }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#1F2937',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography sx={{ fontSize: '12px', color: '#9CA3AF', mb: 1 }}>
                    {item.category} • {formatDate(item.createdAt)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Favorite sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                        {item.likes}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>
                        {item.views}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default UserItemsSection;