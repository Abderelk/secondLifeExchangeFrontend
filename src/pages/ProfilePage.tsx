// src/pages/ProfilePage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Card,
    CardMedia,
    TextField,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Settings,
    Inventory2,
    EmojiEvents,
    LocationOn,
    Verified,
} from '@mui/icons-material';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { getUserItems } from '../services/itemService';
import api from '../services/api';

type TabValue = 'profile' | 'items' | 'badges';

interface UserItem {
    id: string;
    title: string;
    image: string;
    category: string;
    status: 'available' | 'pending' | 'exchanged';
}

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    obtained: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    available: { label: 'Disponible', color: '#16A34A', bgColor: '#DCFCE7' },
    pending: { label: 'En échange', color: '#EA580C', bgColor: '#FED7AA' },
    exchanged: { label: 'Échangé', color: '#6B7280', bgColor: '#F3F4F6' },
};

// Badges par défaut
const defaultBadges: Badge[] = [
    { id: '1', title: 'Premier Échange', description: 'Réalisé votre premier échange', icon: '🎉', obtained: false },
    { id: '2', title: 'Ambassadeur', description: '10 échanges réussis', icon: '⭐', obtained: false },
    { id: '3', title: 'Écolo Expert', description: '25 échanges réussis', icon: '🌱', obtained: false },
    { id: '4', title: 'Membre Actif', description: 'Actif depuis 6 mois', icon: '🏆', obtained: false },
];

export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [tab, setTab] = useState<TabValue>('items');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Items
    const [items, setItems] = useState<UserItem[]>([]);

    // Badges
    const [badges, setBadges] = useState<Badge[]>(defaultBadges);

    // Form data pour l'onglet Profil
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        bio: '',
    });

    // Charger les données
    const fetchData = useCallback(async () => {
        if (!user?._id) return;

        try {
            setLoading(true);
            setError(null);
            const userItems = await getUserItems(user._id);
            const mappedItems: UserItem[] = userItems.map((item) => ({
                id: item._id,
                title: item.title,
                image: item.images?.[0] || 'https://via.placeholder.com/300',
                category: item.category,
                status: item.status,
            }));

            setItems(mappedItems);

            const exchangedCount = mappedItems.filter(i => i.status === 'exchanged').length;

            const updatedBadges = defaultBadges.map(badge => {
                if (badge.id === '1' && exchangedCount >= 1) return { ...badge, obtained: true };
                if (badge.id === '2' && exchangedCount >= 10) return { ...badge, obtained: true };
                if (badge.id === '3' && exchangedCount >= 25) return { ...badge, obtained: true };

                if (badge.id === '4' && user.createdAt) {
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    if (new Date(user.createdAt) <= sixMonthsAgo) {
                        return { ...badge, obtained: true };
                    }
                }

                return badge;
            });

            setBadges(updatedBadges);
        } catch (err) {
            console.error('Erreur chargement profil:', err);
            setError('Impossible de charger les données');
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.createdAt]);


    // Initialiser le formulaire avec les données user
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || user.address?.city || '',
                bio: user.bio || '',
            });
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);

            const response = await api.put('/auth/profile', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                bio: formData.bio,
                address: {
                    city: formData.city,
                },
            });

            if (updateUser && response.data.data) {
                updateUser(response.data.data);
            }

            setSuccess('Profil mis à jour avec succès !');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Erreur sauvegarde:', err);
            setError('Erreur lors de la sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleManageItem = (itemId: string) => {
        navigate(`/items/${itemId}/edit`);
    };

    const handleAddItem = () => {
        navigate('/add-item');
    };

    const getInitials = () => {
        return `${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || 'D'}`.toUpperCase();
    };

    const fullName = `${user?.firstName || 'Utilisateur'} ${user?.lastName || 'Demo'}`;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 6 } }}>
                {/* Profile Header Card */}
                <Card
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        borderRadius: '16px',
                        mb: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: { xs: 2, sm: 3 },
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                >
                    <Avatar
                        sx={{
                            width: { xs: 80, md: 100 },
                            height: { xs: 80, md: 100 },
                            backgroundColor: '#22C55E',
                            fontSize: { xs: 28, md: 36 },
                            fontWeight: 600,
                        }}
                    >
                        {getInitials()}
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: '20px', md: '24px' },
                                fontWeight: 700,
                                color: '#1F2937',
                                mb: 0.5,
                            }}
                        >
                            {fullName}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: '#6B7280',
                                mb: 1.5,
                            }}
                        >
                            {user?.bio || "Passionné(e) par l'économie circulaire et les échanges responsables"}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Chip
                                icon={<LocationOn sx={{ fontSize: 16 }} />}
                                label={user?.city || user?.address?.city || 'Paris, France'}
                                size="small"
                                sx={{
                                    backgroundColor: '#F3F4F6',
                                    color: '#374151',
                                    fontWeight: 500,
                                    '& .MuiChip-icon': { color: '#EF4444' },
                                }}
                            />
                            <Chip
                                icon={<Verified sx={{ fontSize: 16 }} />}
                                label="Membre vérifié"
                                size="small"
                                sx={{
                                    backgroundColor: '#DCFCE7',
                                    color: '#16A34A',
                                    fontWeight: 500,
                                    '& .MuiChip-icon': { color: '#16A34A' },
                                }}
                            />
                        </Box>
                    </Box>
                </Card>

                {/* Tabs */}
                <Card sx={{ borderRadius: '12px', mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, newValue) => setTab(newValue)}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: '#22C55E' },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '14px',
                                color: '#6B7280',
                                py: 1.5,
                                '&.Mui-selected': { color: '#22C55E' },
                            },
                        }}
                    >
                        <Tab value="profile" icon={<Settings sx={{ fontSize: 20 }} />} iconPosition="start" label="Profil" />
                        <Tab value="items" icon={<Inventory2 sx={{ fontSize: 20 }} />} iconPosition="start" label="Mes Objets" />
                        <Tab value="badges" icon={<EmojiEvents sx={{ fontSize: 20 }} />} iconPosition="start" label="Badges" />
                    </Tabs>
                </Card>

                {/* Tab Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: '#22C55E' }} />
                    </Box>
                ) : (
                    <>
                        {/* Onglet Profil */}
                        {tab === 'profile' && (
                            <Card sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', mb: 0.5 }}>
                                    Informations personnelles
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 3 }}>
                                    Modifiez vos informations de profil
                                </Typography>

                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                            Nom complet
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={`${formData.firstName} ${formData.lastName}`}
                                            disabled
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={formData.email}
                                            disabled
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                            Téléphone
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+33 6 12 34 56 78"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                            Localisation
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Paris, France"
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
                                            Bio
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Parlez-nous de vous..."
                                            multiline
                                            rows={3}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Button
                                        variant="contained"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        sx={{
                                            mt: 1,
                                            py: 1.25,
                                            backgroundColor: '#22C55E',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            alignSelf: 'flex-start',
                                            px: 4,
                                            '&:hover': { backgroundColor: '#16A34A' },
                                        }}
                                    >
                                        {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Enregistrer les modifications'}
                                    </Button>
                                </Box>
                            </Card>
                        )}

                        {/* Onglet Mes Objets */}
                        {tab === 'items' && (
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
                                                    onClick={() => handleManageItem(item.id)}
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
                                    onClick={handleAddItem}
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
                        )}

                        {/* Onglet Badges */}
                        {tab === 'badges' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {badges.map((badge) => (
                                    <Card
                                        key={badge.id}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            opacity: badge.obtained ? 1 : 0.6,
                                            border: badge.obtained ? '2px solid #22C55E' : '1px solid #E5E7EB',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: '12px',
                                                backgroundColor: badge.obtained ? '#DCFCE7' : '#F3F4F6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <EmojiEvents sx={{ fontSize: 28, color: badge.obtained ? '#22C55E' : '#9CA3AF' }} />
                                        </Box>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
                                                {badge.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                                                {badge.description}
                                            </Typography>
                                        </Box>

                                        {badge.obtained && (
                                            <Chip
                                                label="Obtenu"
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#22C55E',
                                                    color: '#FFFFFF',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                }}
                                            />
                                        )}
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </>
                )}
            </Container>
            <BottomNavigation />
        </Box>
    );
};

export default ProfilePage;