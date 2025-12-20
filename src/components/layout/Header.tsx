// src/components/layout/Header.tsx

import { useNavigate } from 'react-router-dom';
import { Box, Container, Button, Typography } from '@mui/material';
import {
  Home,
  CalendarMonth,
  SwapHoriz,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavButton = ({ icon, label, active = false, onClick }: NavButtonProps) => (
  <Button
    startIcon={icon}
    onClick={onClick}
    sx={{
      backgroundColor: active ? '#22C55E' : 'transparent',
      color: active ? '#FFFFFF' : '#6B7280',
      textTransform: 'none',
      fontWeight: 500,
      borderRadius: '20px',
      px: 2,
      '&:hover': {
        backgroundColor: active ? '#16A34A' : '#F3F4F6',
      },
    }}
  >
    {label}
  </Button>
);

interface HeaderProps {
  activePage?: 'home' | 'calendar' | 'exchanges' | 'profile';
}

export const Header = ({ activePage = 'home' }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1.5,
          }}
        >
          {/* Logo */}
          <img
            src="/logo.jpeg"
            alt="SecondLife Exchange"
            style={{ height: '40px', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => navigate('/home')}
          />

          {/* Navigation - Desktop only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <NavButton
              icon={<Home />}
              label="Accueil"
              active={activePage === 'home'}
              onClick={() => navigate('/home')}
            />
            <NavButton
              icon={<CalendarMonth />}
              label="Calendrier"
              active={activePage === 'calendar'}
              onClick={() => navigate('/calendar')}
            />
            <NavButton
              icon={<SwapHoriz />}
              label="Échanges"
              active={activePage === 'exchanges'}
              onClick={() => navigate('/exchanges')}
            />
            <NavButton
              icon={<Person />}
              label="Profil"
              active={activePage === 'profile'}
              onClick={() => navigate('/profile')}
            />
          </Box>

          {/* User - Desktop only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#6B7280', fontSize: '14px' }}>
              Bonjour, {user?.firstName || 'Utilisateur'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                textTransform: 'none',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Déconnexion
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;