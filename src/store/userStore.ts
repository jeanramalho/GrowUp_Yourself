import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    avatarUri: string | null;
    notificationsEnabled: boolean;
    setAvatar: (uri: string | null) => void;
    setNotifications: (enabled: boolean) => void;
    toggleNotifications: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            avatarUri: null,
            notificationsEnabled: false,
            setAvatar: (uri) => set({ avatarUri: uri }),
            setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
