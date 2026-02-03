// FRONTEND/src/services/themeService.ts

import api from './api';

// Types
export interface Theme {
    _id: string;
    name: string;
    description: string;
    icon: string;
    startDate: string;
    endDate: string;
    categories: string[];
    isActive: boolean;
    status: 'past' | 'current' | 'upcoming';
    weekNumber: number;
    daysRemaining: number;
    dateRange: string;
    createdAt: string;
    updatedAt: string;
}

export interface CalendarResponse {
    success: boolean;
    year: number;
    count: number;
    data: Theme[];
}

export interface ThemeResponse {
    success: boolean;
    data: Theme;
    message?: string;
}

export interface ThemesResponse {
    success: boolean;
    count: number;
    data: Theme[];
}

// Services

/**
 * Récupérer tous les thèmes avec filtres optionnels
 */
export const getAllThemes = async (params?: {
    year?: number;
    month?: number;
    status?: 'past' | 'current' | 'upcoming';
    limit?: number;
}): Promise<Theme[]> => {
    const queryParams = new URLSearchParams();
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get<ThemesResponse>(`/themes?${queryParams.toString()}`);
    return response.data.data;
};

/**
 * Récupérer le thème actuel
 */
export const getCurrentTheme = async (): Promise<Theme | null> => {
    try {
        const response = await api.get<ThemeResponse>('/themes/current');
        return response.data.data;
    } catch (error) {
        console.error('Erreur getCurrentTheme:', error);
        return null;
    }
};

/**
 * Récupérer le calendrier des thèmes pour une année
 */
export const getCalendar = async (year?: number): Promise<Theme[]> => {
    const queryParams = year ? `?year=${year}` : '';
    const response = await api.get<CalendarResponse>(`/themes/calendar${queryParams}`);
    return response.data.data;
};

/**
 * Récupérer les prochains thèmes
 */
export const getUpcomingThemes = async (limit: number = 5): Promise<Theme[]> => {
    const response = await api.get<ThemesResponse>(`/themes/upcoming?limit=${limit}`);
    return response.data.data;
};

/**
 * Récupérer un thème par ID
 */
export const getThemeById = async (id: string): Promise<Theme> => {
    const response = await api.get<ThemeResponse>(`/themes/${id}`);
    return response.data.data;
};

// Admin functions

/**
 * Créer un nouveau thème (Admin)
 */
export const createTheme = async (theme: Partial<Theme>): Promise<Theme> => {
    const response = await api.post<ThemeResponse>('/themes', theme);
    return response.data.data;
};

/**
 * Mettre à jour un thème (Admin)
 */
export const updateTheme = async (id: string, theme: Partial<Theme>): Promise<Theme> => {
    const response = await api.put<ThemeResponse>(`/themes/${id}`, theme);
    return response.data.data;
};

/**
 * Supprimer un thème (Admin)
 */
export const deleteTheme = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};

// Export par défaut
const themeService = {
    getAllThemes,
    getCurrentTheme,
    getCalendar,
    getUpcomingThemes,
    getThemeById,
    createTheme,
    updateTheme,
    deleteTheme,
};

export default themeService;