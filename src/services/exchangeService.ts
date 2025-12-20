// src/services/exchangeService.ts

import api from './api';

export interface ExchangeItem {
  _id: string;
  title: string;
  images: string[];
  category?: string;
  condition?: string;
}

export interface ExchangeUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  email?: string;
}

export interface Exchange {
  _id: string;
  requester: ExchangeUser;
  owner: ExchangeUser;
  requestedItem: ExchangeItem;
  offeredItems: ExchangeItem[];
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  responseMessage?: string;
  respondedAt?: string;
  meetingDetails?: {
    date: string;
    location: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateExchangeData {
  requestedItemId: string;
  offeredItemIds?: string[];
  message?: string;
}

export interface RespondToExchangeData {
  action: 'accept' | 'reject';
  responseMessage?: string;
  meetingDetails?: {
    date: string;
    location: string;
    notes?: string;
  };
}

// Créer une proposition d'échange
export const createExchange = async (data: CreateExchangeData): Promise<Exchange> => {
  const response = await api.post('/exchanges', data);
  return response.data.data;
};

// Obtenir mes échanges
export const getMyExchanges = async (
  type: 'all' | 'sent' | 'received' = 'all',
  status?: string
): Promise<Exchange[]> => {
  const params = new URLSearchParams();
  params.append('type', type);
  if (status) params.append('status', status);

  const response = await api.get(`/exchanges?${params.toString()}`);
  return response.data.data;
};

// Obtenir un échange par ID
export const getExchangeById = async (id: string): Promise<Exchange> => {
  const response = await api.get(`/exchanges/${id}`);
  return response.data.data;
};

// Répondre à un échange
export const respondToExchange = async (
  id: string,
  data: RespondToExchangeData
): Promise<Exchange> => {
  const response = await api.post(`/exchanges/${id}/respond`, data);
  return response.data.data;
};

// Compléter un échange
export const completeExchange = async (id: string): Promise<void> => {
  await api.post(`/exchanges/${id}/complete`);
};

// Annuler un échange
export const cancelExchange = async (id: string): Promise<void> => {
  await api.post(`/exchanges/${id}/cancel`);
};

// Obtenir mes items pour proposer un échange
export const getMyItemsForExchange = async (): Promise<ExchangeItem[]> => {
  const response = await api.get('/exchanges/my-items');
  return response.data.data;
};

export default {
  createExchange,
  getMyExchanges,
  getExchangeById,
  respondToExchange,
  completeExchange,
  cancelExchange,
  getMyItemsForExchange,
};