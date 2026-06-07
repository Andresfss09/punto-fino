import { create } from 'zustand';

const useAppStore = create((set) => ({
  services: [],
  barbers: [],
  notifications: [],
  unreadCount: 0,

  setServices: (services) => set({ services }),
  setBarbers: (barbers) => set({ barbers }),
  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
}));

export default useAppStore;