// src/components/layout/Navbar.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container
} from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/home');
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  const getUserFullName = () => {
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        color: '#111827'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '80px' }}>
          <div
            className="flex items-center gap-3 cursor-pointer flex-1"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <Typography
              variant="h6"
              component="div"
              className="font-bold text-gray-900"
            >
              SecondLife
            </Typography>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Typography variant="body1" className="text-gray-700 hidden md:block">
                {getUserFullName()}
              </Typography>
              <IconButton
                onClick={handleMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    backgroundColor: '#059669',
                    fontWeight: 'bold'
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    minWidth: 200,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }
                }}
              >
                <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                  <AccountCircle className="mr-3 text-gray-600" />
                  Mon profil
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <Logout className="mr-3 text-gray-600" />
                  Déconnexion
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  color: '#059669',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  borderRadius: '10px'
                }}
              >
                Connexion
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: '#059669',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#047857',
                    boxShadow: 'none'
                  }
                }}
              >
                Inscription
              </Button>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};