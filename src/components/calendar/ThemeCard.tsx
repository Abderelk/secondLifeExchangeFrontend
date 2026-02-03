import { Box, Typography, Chip, Card } from '@mui/material';
import {type  Theme } from '../../types/theme';

interface ThemeCardProps {
    theme: Theme;
}

const ThemeCard = ({ theme }: ThemeCardProps) => {
    const getBorderStyle = () => {
        if (theme.status === 'current') return '2px solid #22C55E';
        return '1px solid #E5E7EB';
    };

    const getBadgeStyle = () => {
        switch (theme.status) {
            case 'current':
                return {
                    backgroundColor: '#22C55E',
                    color: '#FFFFFF',
                };
            case 'upcoming':
                return {
                    backgroundColor: '#DBEAFE',
                    color: '#2563EB',
                };
            case 'completed':
                return {
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280',
                };
            default:
                return {};
        }
    };

    const getStatusLabel = () => {
        switch (theme.status) {
            case 'current':
                return 'En cours';
            case 'upcoming':
                return 'À venir';
            case 'completed':
                return 'Terminée';
            default:
                return '';
        }
    };

    const getIconBgColor = () => {
        if (theme.status === 'current') return '#DCFCE7';
        return '#DBEAFE';
    };

    return (
        <Card
            sx={{
                borderRadius: '16px',
                padding: 2.5,
                border: getBorderStyle(),
                boxShadow: 'none',
                transition: 'box-shadow 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
            }}
        >
            {/* Header avec icône, titre et badge */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            backgroundColor: getIconBgColor(),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                        }}
                    >
                        {theme.icon}
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} color="#1F2937">
                            {theme.name}
                        </Typography>
                        <Typography variant="body2" color="#9CA3AF">
                            Semaine {theme.week}
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={getStatusLabel()}
                    size="small"
                    sx={{
                        ...getBadgeStyle(),
                        fontWeight: 500,
                        fontSize: '12px',
                        height: '26px',
                    }}
                />
            </Box>

            {/* Date */}
            <Typography variant="body2" fontWeight={500} color="#374151" sx={{ mb: 1 }}>
                {theme.dateRange}
            </Typography>

            {/* Description */}
            <Typography variant="body2" color="#6B7280">
                {theme.description}
            </Typography>
        </Card>
    );
};

export default ThemeCard;