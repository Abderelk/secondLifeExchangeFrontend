// src/components/profile/ProfileHeader.tsx

import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Edit, LocationOn, CalendarMonth } from '@mui/icons-material';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    city?: string;
    joinedAt: string;
    bio?: string;
}

interface ProfileHeaderProps {
    user: UserProfile;
    onEdit?: () => void;
    isOwnProfile?: boolean;
}

export const ProfileHeader = ({ user, onEdit, isOwnProfile = true }: ProfileHeaderProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
        });
    };

    const getInitials = () => {
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                pt: { xs: 4, md: 6 },
                pb: { xs: 8, md: 10 },
                px: { xs: 2, md: 3 },
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    maxWidth: 'lg',
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: 3,
                }}
            >
                {/* Avatar */}
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={user.avatar}
                        sx={{
                            width: { xs: 100, md: 120 },
                            height: { xs: 100, md: 120 },
                            border: '4px solid #FFFFFF',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            fontSize: { xs: 36, md: 42 },
                            backgroundColor: '#1F2937',
                        }}
                    >
                        {getInitials()}
                    </Avatar>
                    {isOwnProfile && (
                        <IconButton
                            onClick={onEdit}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                '&:hover': { backgroundColor: '#F3F4F6' },
                            }}
                            size="small"
                        >
                            <Edit sx={{ fontSize: 18, color: '#22C55E' }} />
                        </IconButton>
                    )}
                </Box>

                {/* Infos */}
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
                    <Typography
                        sx={{
                            fontSize: { xs: '24px', md: '32px' },
                            fontWeight: 700,
                            color: '#FFFFFF',
                            mb: 0.5,
                        }}
                    >
                        {user.firstName} {user.lastName}
                    </Typography>

                    {user.bio && (
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.9)',
                                mb: 2,
                                maxWidth: 400,
                            }}
                        >
                            {user.bio}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 2, md: 3 },
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                        }}
                    >
                        {user.city && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOn sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
                                <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                    {user.city}
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarMonth sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
                            <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                Membre depuis {formatDate(user.joinedAt)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileHeader;