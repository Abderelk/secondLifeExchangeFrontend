// src/components/common/FloatingAddButton.tsx

import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const FloatingAddButton = () => {
  const navigate = useNavigate();

  return (
    <Fab
      onClick={() => navigate('/add-item')}
      sx={{
        position: 'fixed',
        bottom: { xs: 80, md: 32 }, // Plus haut sur mobile pour éviter la bottom nav
        right: { xs: 16, md: 32 },
        backgroundColor: '#22C55E',
        color: '#FFFFFF',
        width: { xs: 56, md: 64 },
        height: { xs: 56, md: 64 },
        boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
        '&:hover': {
          backgroundColor: '#16A34A',
        },
        zIndex: 999,
      }}
    >
      <Add sx={{ fontSize: { xs: 28, md: 32 } }} />
    </Fab>
  );
};

export default FloatingAddButton;