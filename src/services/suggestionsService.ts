// src/services/suggestionsService.ts

import api from './api';

export interface RecommendedItem {
    id: string;
    image: string;
    category: string;
    title: string;
    description: string;
    ownerName: string;
    location: string;
    likes: number;
    isLiked: boolean;
}

export interface AISuggestionsResponse {
    greeting: string;
    suggestionsToPropose: string[];
    reasonToPropose: string;
    recommendedCategories: string[];
    reasonForRecommendation: string;
    tip: string;
    recommendedItems: RecommendedItem[];
    context: {
        season: string;
        weeklyTheme: string;
        weeklyThemeEmoji: string;
    };
}

// Récupérer les suggestions personnalisées
export const getPersonalizedSuggestions = async (): Promise<AISuggestionsResponse> => {
    const response = await api.get('/suggestions');
    return response.data.data;
};

export default {
    getPersonalizedSuggestions,
};