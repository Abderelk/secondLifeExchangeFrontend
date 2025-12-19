// src/services/homeService.ts

import api from './api';

export interface HomeData {
    weeklyTheme: {
        title: string;
        emoji: string;
        dateRange: string;
        description: string;
    };
    stats: Array<{
        icon: string;
        title: string;
        value: string;
        subtitle: string;
        color: string;
    }>;
    items: Array<{
        id: string;
        image: string;
        category: string;
        title: string;
        description: string;
        ownerName: string;
        location: string;
        likes: number;
        isLiked: boolean;
    }>;
}

// Récupérer toutes les données de la HomePage
export const getHomeData = async (): Promise<HomeData> => {
    const response = await api.get('/home');
    return response.data.data;
};

export default { getHomeData };