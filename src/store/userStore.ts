import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    userName: string;
    userLevel: number;
    userTitle: string;
    avatarUri: string | null;
    notificationsEnabled: boolean;
    setUserName: (name: string) => void;
    setUserLevel: (level: number) => void;
    setUserTitle: (title: string) => void;
    setAvatar: (uri: string | null) => void;
    setNotifications: (enabled: boolean) => void;
    toggleNotifications: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userName: 'Jean Ramalho',
            userLevel: 5,
            userTitle: 'Explorador Nível 5',
            avatarUri: null,
            notificationsEnabled: false,
            setUserName: (userName) => set({ userName }),
            setUserLevel: (userLevel) => set({ userLevel }),
            setUserTitle: (userTitle) => set({ userTitle }),
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
