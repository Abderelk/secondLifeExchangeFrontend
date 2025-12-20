// src/components/layout/BottomNavigation.tsx

import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Home,
  HomeOutlined,
  CalendarMonth,
  CalendarMonthOutlined,
  ChatBubble,
  ChatBubbleOutline,
  Person,
  PersonOutline,
} from '@mui/icons-material';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/home',
    label: 'Accueil',
    icon: <HomeOutlined />,
    activeIcon: <Home />,
  },
  {
    path: '/calendar',
    label: 'Calendrier',
    icon: <CalendarMonthOutlined />,
    activeIcon: <CalendarMonth />,
  },
  {
    path: '/exchanges',
    label: 'Messages',
    icon: <ChatBubbleOutline />,
    activeIcon: <ChatBubble />,
  },
  {
    path: '/profile',
    label: 'Profil',
    icon: <PersonOutline />,
    activeIcon: <Person />,
  },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Box
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 1.5,
              cursor: 'pointer',
              color: isActive ? '#22C55E' : '#6B7280',
              transition: 'color 0.2s',
              '&:active': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <Box sx={{ fontSize: 24, mb: 0.5 }}>
              {isActive ? item.activeIcon : item.icon}
            </Box>
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BottomNavigation;