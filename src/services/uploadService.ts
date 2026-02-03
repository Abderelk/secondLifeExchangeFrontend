// src/services/uploadService.ts

import api from './api'; // Ton instance axios configurée

const API_URL = '/upload';

const uploadService = {
    /**
     * Upload une seule image
     */
    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post(`${API_URL}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data.url;
    },

    /**
     * Upload plusieurs images
     */
    async uploadImages(files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        const response = await api.post(`${API_URL}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data.urls;
    },

    /**
     * Supprimer une image
     */
    async deleteImage(imageUrl: string): Promise<void> {
        await api.delete(`${API_URL}/image`, {
            data: { imageUrl },
        });
    },
};

// Export par défaut et nommé pour flexibilité
export { uploadService };
export default uploadService;