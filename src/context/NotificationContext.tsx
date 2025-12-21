// src/context/NotificationContext.tsx

import { createContext, useContext } from 'react';

export interface NotificationContextType {
    unreadMessages: number;
    refreshUnreadCount: () => Promise<void>;
    clearUnreadMessages: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);


export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider"
        );
    }
    return context;
};