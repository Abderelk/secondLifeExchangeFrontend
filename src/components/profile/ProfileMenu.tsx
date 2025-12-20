// src/components/profile/ProfileMenu.tsx

import { Box, Card, Typography, Divider } from '@mui/material';
import {
    Person,
    Settings,
    Notifications,
    Help,
    Logout,
    ChevronRight,
} from '@mui/icons-material';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    description?: string;
    onClick?: () => void;
    danger?: boolean;
}

interface ProfileMenuProps {
    onEditProfile?: () => void;
    onSettings?: () => void;
    onNotifications?: () => void;
    onHelp?: () => void;
    onLogout?: () => void;
}

const MenuRow = ({ icon, label, description, onClick, danger }: MenuItem) => (
    <Box
        onClick={onClick}
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
                backgroundColor: danger ? '#FEF2F2' : '#F9FAFB',
            },
        }}
    >
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: danger ? '#FEE2E2' : '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: danger ? '#EF4444' : '#6B7280',
            }}
        >
            {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
            <Typography
                sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    color: danger ? '#EF4444' : '#1F2937',
                }}
            >
                {label}
            </Typography>
            {description && (
                <Typography sx={{ fontSize: '13px', color: '#9CA3AF' }}>
                    {description}
                </Typography>
            )}
        </Box>
        <ChevronRight sx={{ color: '#D1D5DB', fontSize: 20 }} />
    </Box>
);

export const ProfileMenu = ({
    onEditProfile,
    onSettings,
    onNotifications,
    onHelp,
    onLogout,
}: ProfileMenuProps) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                sx={{
                    fontSize: { xs: '18px', md: '20px' },
                    fontWeight: 700,
                    color: '#1F2937',
                    mb: 3,
                }}
            >
                Paramètres
            </Typography>

            <Card
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #E5E7EB',
                }}
            >
                <MenuRow
                    icon={<Person />}
                    label="Modifier mon profil"
                    description="Nom, photo, bio, localisation"
                    onClick={onEditProfile}
                />
                <Divider />
                <MenuRow
                    icon={<Notifications />}
                    label="Notifications"
                    description="Gérer les alertes"
                    onClick={onNotifications}
                />
                <Divider />
                <MenuRow
                    icon={<Settings />}
                    label="Paramètres"
                    description="Confidentialité, sécurité"
                    onClick={onSettings}
                />
                <Divider />
                <MenuRow
                    icon={<Help />}
                    label="Aide & Support"
                    description="FAQ, nous contacter"
                    onClick={onHelp}
                />
                <Divider />
                <MenuRow
                    icon={<Logout />}
                    label="Déconnexion"
                    onClick={onLogout}
                    danger
                />
            </Card>
        </Box>
    );
};

export default ProfileMenu;