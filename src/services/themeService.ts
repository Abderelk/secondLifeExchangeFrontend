// src/services/themeService.ts

import api from './api';

export interface WeeklyTheme {
    _id: string;
    title: string;
    emoji: string;
    description: string;
    categories: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    itemsCount: number;
    participantsCount: number;
    daysRemaining?: number;
    status?: 'past' | 'current' | 'upcoming';
    createdAt: string;
    updatedAt: string;
}

export interface NotificationPreferences {
    email: boolean;
    weeklyTheme: boolean;
    newMessages: boolean;
    exchangeUpdates: boolean;
}

// Obtenir le thème actuel
export const getCurrentTheme = async (): Promise<WeeklyTheme> => {
    const response = await api.get('/themes/current');
    return response.data.data;
};

// Obtenir le calendrier des thèmes
export const getThemeCalendar = async (month?: number, year?: number): Promise<WeeklyTheme[]> => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());

    const response = await api.get(`/themes/calendar?${params.toString()}`);
    return response.data.data;
};

// Obtenir les prochains thèmes
export const getUpcomingThemes = async (): Promise<WeeklyTheme[]> => {
    const response = await api.get('/themes/upcoming');
    return response.data.data;
};

// Obtenir les préférences de notification
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
    const response = await api.get('/themes/notifications/preferences');
    return response.data.data;
};

// Mettre à jour les préférences de notification
export const updateNotificationPreferences = async (
    preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
    const response = await api.put('/themes/notifications/preferences', preferences);
    return response.data.data;
};

// === Admin only ===

// Créer un nouveau thème (Admin)
export const createTheme = async (theme: Partial<WeeklyTheme>): Promise<WeeklyTheme> => {
    const response = await api.post('/themes', theme);
    return response.data.data;
};

// Mettre à jour un thème (Admin)
export const updateTheme = async (id: string, theme: Partial<WeeklyTheme>): Promise<WeeklyTheme> => {
    const response = await api.put(`/themes/${id}`, theme);
    return response.data.data;
};

// Supprimer un thème (Admin)
export const deleteTheme = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};

// Envoyer les notifications pour un thème (Admin)
export const sendThemeNotifications = async (themeId: string): Promise<{ total: number; sent: number; failed: number }> => {
    const response = await api.post(`/themes/${themeId}/notify`);
    return response.data.data;
};

export default {
    getCurrentTheme,
    getThemeCalendar,
    getUpcomingThemes,
    getNotificationPreferences,
    updateNotificationPreferences,
    createTheme,
    updateTheme,
    deleteTheme,
    sendThemeNotifications,
};