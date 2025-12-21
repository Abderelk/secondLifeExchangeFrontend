import { useState, useCallback, type ReactNode } from "react";
import { NotificationContext } from "./NotificationContext";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../services/messageService";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [unreadMessages, setUnreadMessages] = useState(0);

    const refreshUnreadCount = useCallback(async () => {
        if (!user) {
            setUnreadMessages(0);
            return;
        }

        try {
            const count = await getUnreadCount();
            setUnreadMessages(count);
        } catch (error) {
            console.error("Erreur récupération notifications:", error);
        }
    }, [user]);

    const clearUnreadMessages = useCallback(() => {
        setUnreadMessages(0);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                unreadMessages,
                refreshUnreadCount,
                clearUnreadMessages,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
