// src/pages/ProfilePage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, CircularProgress } from '@mui/material';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { getUserItems } from '../services/itemService';
import api from '../services/api';
import {
  ProfileHeaderCard,
  ProfileTabs,
  ProfileEditTab,
  ItemsTab,
  BadgesTab,
} from '../components/profile';

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
  const [items, setItems] = useState<UserItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
  });

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
        address: { city: formData.city },
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

  const getInitials = () => {
    return `${user?.firstName?.charAt(0) || 'U'}${user?.lastName?.charAt(0) || 'D'}`.toUpperCase();
  };

  const fullName = `${user?.firstName || 'Utilisateur'} ${user?.lastName || 'Demo'}`;
  const city = user?.city || user?.address?.city || 'Paris, France';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 }, pb: { xs: 12, md: 6 } }}>
        <ProfileHeaderCard
          initials={getInitials()}
          fullName={fullName}
          bio={user?.bio}
          city={city}
        />

        <ProfileTabs value={tab} onChange={setTab} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#22C55E' }} />
          </Box>
        ) : (
          <>
            {tab === 'profile' && (
              <ProfileEditTab
                formData={formData}
                onChange={handleChange}
                onSave={handleSaveProfile}
                saving={saving}
                error={error}
                success={success}
              />
            )}

            {tab === 'items' && (
              <ItemsTab
                items={items}
                onManageItem={(itemId) => navigate(`/items/${itemId}/edit`)}
                onAddItem={() => navigate('/add-item')}
              />
            )}

            {tab === 'badges' && (
              <BadgesTab badges={badges} />
            )}
          </>
        )}
      </Container>
      <BottomNavigation />
    </Box>
  );
};

export default ProfilePage;
