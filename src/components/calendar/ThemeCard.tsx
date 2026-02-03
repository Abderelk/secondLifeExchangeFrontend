// FRONTEND/src/components/calendar/ThemeCard.tsx

import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Divider, useTheme } from '@mui/material';
import { CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { type Theme } from '../../services/themeService';

// Composant Badge de statut
const StatusBadge: React.FC<{ status: Theme['status'] }> = ({ status }) => {
    const config = {
        past: { label: 'Terminée', color: 'default' as const },
        current: { label: 'En cours', color: 'success' as const },
        upcoming: { label: 'À venir', color: 'default' as const },
    };

    const { label, color } = config[status];

    return (
        <Chip
            label={label}
            color={color}
            size="small"
            sx={{
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': { px: 1.5 },
            }}
        />
    );
};

interface ThemeCardProps {
    theme: Theme;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme }) => {
    const muiTheme = useTheme();
    const isCurrent = theme.status === 'current';
    const isPast = theme.status === 'past';

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                border: isCurrent
                    ? `2px solid ${muiTheme.palette.success.main}`
                    : '1px solid #e5e7eb',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                opacity: isPast ? 0.7 : 1,
                '&:hover': {
                    borderColor: isCurrent
                        ? muiTheme.palette.success.main
                        : muiTheme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h4" component="span">
                        {theme.icon}
                    </Typography>
                    <StatusBadge status={theme.status} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
                    {theme.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                    }}
                >
                    {theme.description}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        Semaine {theme.weekNumber} • {theme.dateRange}
                    </Typography>
                </Box>

                {theme.categories.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                        {theme.categories.slice(0, 3).map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 22 }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ThemeCard;