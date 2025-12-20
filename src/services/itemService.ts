// src/services/itemService.ts

import api from './api';
import type { Item } from '../components/items/ItemCard';
import type { ApiItem } from '../types';

export interface ItemsResponse {
    data: Item[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ItemFilters {
    category?: string;
    city?: string;
    status?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export interface CreateItemData {
    title: string;
    description: string;
    category: string;
    images?: string[];
    condition: 'neuf' | 'très bon' | 'bon' | 'correct' | 'usé';
    location?: {
        city: string;
        postalCode: string;
    };
    exchangePreferences?: string[];
}

// Récupérer les items avec filtres
export const getItems = async (filters: ItemFilters = {}): Promise<ItemsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const response = await api.get(`/items?${params.toString()}`);
    return response.data;
};

// Récupérer un item par ID
export const getItemById = async (id: string) => {
    const response = await api.get(`/items/${id}`);
    return response.data.data;
};

// Créer un nouvel item
export const createItem = async (data: CreateItemData) => {
    const response = await api.post('/items', data);
    return response.data.data;
};

// Mettre à jour un item
export const updateItem = async (id: string, data: Partial<CreateItemData>) => {
    const response = await api.put(`/items/${id}`, data);
    return response.data.data;
};

// Supprimer un item
export const deleteItem = async (id: string) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
};

// Liker/Unliker un item
export const toggleLike = async (id: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const response = await api.post(`/items/${id}/like`);
    return response.data.data;
};

// Récupérer les items d'un utilisateur
export const getUserItems = async (userId: string): Promise<ApiItem[]> => {
    const response = await api.get(`/items/user/${userId}`);
    return response.data.data;
};

export default {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    toggleLike,
    getUserItems,
};