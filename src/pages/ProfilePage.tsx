// src/pages/ProfilePage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProfileHeader, type UserProfile } from '../components/profile/ProfileHeader';
import { ProfileStats, type UserStats } from '../components/profile/ProfileStats';
import { UserItemsSection, type UserItem } from '../components/profile/UserItemsSection';
import { ProfileMenu } from '../components/profile/ProfileMenu';
import { useAuth } from '../context/AuthContext';
import { getUserItems, deleteItem } from '../services/itemService';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userItems, setUserItems] = useState<UserItem[]>([]);
    const [stats, setStats] = useState<UserStats>({
        itemsCount: 0,
        exchangesCount: 0,
        likesReceived: 0,
        viewsCount: 0,
    });

    const fetchUserData = useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);

            // Récupérer les items de l'utilisateur
            const items = await getUserItems(user.id);

            // Mapper les items
            const mappedItems: UserItem[] = items.map((item: {
                _id: string;
                title: string;
                images?: string[];
                category: string;
                status: 'available' | 'pending' | 'exchanged' | 'removed';
                likesCount?: number;
                views?: number;
                createdAt: string;
            }) => ({
                id: item._id,
                title: item.title,
                image: item.images?.[0] || '',
                category: item.category,
                status: item.status,
                likes: item.likesCount || 0,
                views: item.views || 0,
                createdAt: item.createdAt,
            }));

            setUserItems(mappedItems);

            // Calculer les stats
            const totalLikes = mappedItems.reduce((sum, item) => sum + item.likes, 0);
            const totalViews = mappedItems.reduce((sum, item) => sum + item.views, 0);
            const exchangedCount = mappedItems.filter((item) => item.status === 'exchanged').length;

            setStats({
                itemsCount: mappedItems.length,
                exchangesCount: exchangedCount,
                likesReceived: totalLikes,
                viewsCount: totalViews,
            });
        } catch (err) {
            console.error('Erreur chargement profil:', err);
            setError('Impossible de charger les données du profil');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleEditProfile = () => {
        navigate('/profile/edit');
    };

    const handleEditItem = (itemId: string) => {
        navigate(`/items/${itemId}/edit`);
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) return;

        try {
            await deleteItem(itemId);
            setUserItems((prev) => prev.filter((item) => item.id !== itemId));
            setStats((prev) => ({ ...prev, itemsCount: prev.itemsCount - 1 }));
        } catch (err) {
            console.error('Erreur suppression:', err);
        }
    };

    const handleItemClick = (itemId: string) => {
        navigate(`/items/${itemId}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const handleNotifications = () => {
        navigate('/notifications');
    };

    const handleHelp = () => {
        navigate('/help');
    };

    // Profil utilisateur formaté
    const userProfile: UserProfile = {
        id: user?.id || '',
        firstName: user?.firstName || 'Utilisateur',
        lastName: user?.lastName || '',
        email: user?.email || '',
        avatar: user?.avatar,
        city: user?.city || user?.address?.city || '',
        joinedAt: user?.createdAt || new Date().toISOString(),
        bio: user?.bio,
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
                <Header activePage="profile" />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh',
                    }}
                >
                    <CircularProgress sx={{ color: '#22C55E' }} />
                </Box>
                <BottomNavigation />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Header activePage="profile" />

            {/* Profile Header with gradient background */}
            <ProfileHeader
                user={userProfile}
                onEdit={handleEditProfile}
                isOwnProfile={true}
            />

            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: { xs: 12, md: 6 } }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, mt: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Stats Cards */}
                <ProfileStats stats={stats} />

                {/* User's Items */}
                <UserItemsSection
                    items={userItems}
                    isOwnProfile={true}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onItemClick={handleItemClick}
                />

                {/* Settings Menu */}
                <ProfileMenu
                    onEditProfile={handleEditProfile}
                    onSettings={handleSettings}
                    onNotifications={handleNotifications}
                    onHelp={handleHelp}
                    onLogout={handleLogout}
                />
            </Container>

            <Footer />
            <BottomNavigation />
        </Box>
    );
};

export default ProfilePage;