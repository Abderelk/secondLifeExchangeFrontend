// FRONTEND/src/components/layout/Layout.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
    children: React.ReactNode;
}

// Mapping des chemins vers les pages actives pour le Header
const getActivePage = (pathname: string): 'home' | 'calendar' | 'messages' | 'profile' => {
    if (pathname.startsWith('/calendar')) return 'calendar';
    if (pathname.startsWith('/messages')) return 'messages';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const activePage = getActivePage(location.pathname);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Header activePage={activePage} />

            {/* Contenu principal */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    // Padding bottom pour la BottomNavigation sur mobile
                    pb: { xs: 8, md: 0 },
                }}
            >
                {children}
            </Box>

            {/* Footer */}
            <Footer />

            {/* Bottom Navigation (mobile only) */}
            <BottomNavigation />
        </Box>
    );
};

export default Layout;