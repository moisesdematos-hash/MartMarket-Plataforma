// ==============================================================================
// MARTMARKET NOTIFICATION & TOAST CONTEXT
// ==============================================================================

import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  toasts: ToastMessage[];
  notifications: NotificationItem[];
  showToast: (type: ToastMessage['type'], message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'usr-creator-1',
      type: 'sale',
      title: 'Nova Venda Confirmada!',
      message: 'Parabéns! Uma nova inscrição no curso "Masterclass Fullstack" foi concluída via Multicaixa Express (35.000 Kz).',
      isRead: false,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-2',
      userId: 'usr-creator-1',
      type: 'commission',
      title: 'Comissão de Afiliado Gerada',
      message: 'O afiliado Carlos Lima gerou uma venda do Guia Prático de Finanças.',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    }
  ]);

  const showToast = (
    type: ToastMessage['type'],
    message: string,
    title?: string,
    duration = 4000
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const newToast: ToastMessage = { id, type, title, message, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        showToast,
        removeToast,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
