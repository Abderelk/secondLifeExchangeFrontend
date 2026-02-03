// FRONTEND/src/components/calendar/CurrentThemeCard.tsx

import React from 'react';
import { Box, Typography, Paper, Chip, alpha, useTheme } from '@mui/material';
import { CalendarMonth as CalendarIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { type Theme } from '../../services/themeService';

interface CurrentThemeCardProps {
    theme: Theme;
}

const CurrentThemeCard: React.FC<CurrentThemeCardProps> = ({ theme }) => {
    const muiTheme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                background: `linear-gradient(135deg, ${muiTheme.palette.success.main} 0%, ${muiTheme.palette.success.dark} 100%)`,
                borderRadius: 3,
                p: 3,
                mb: 4,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Cercles décoratifs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    bgcolor: alpha('#fff', 0.1),
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    right: 100,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: alpha('#fff', 0.05),
                }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                        label="Thème de la semaine"
                        size="small"
                        sx={{
                            bgcolor: alpha('#fff', 0.2),
                            color: 'white',
                            fontWeight: 500,
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h3" component="span">
                        {theme.icon}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {theme.name}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2, maxWidth: 600 }}>
                    {theme.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarIcon fontSize="small" />
                        <Typography variant="body2">{theme.dateRange}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon fontSize="small" />
                        <Typography variant="body2">
                            {theme.daysRemaining > 0
                                ? `${theme.daysRemaining} jour${theme.daysRemaining > 1 ? 's' : ''} restant${theme.daysRemaining > 1 ? 's' : ''}`
                                : 'Dernier jour !'}
                        </Typography>
                    </Box>
                </Box>

                {theme.categories.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        {theme.categories.map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                size="small"
                                sx={{
                                    bgcolor: alpha('#fff', 0.15),
                                    color: 'white',
                                    fontSize: '0.7rem',
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CurrentThemeCard;