import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    userName: string;
    userLevel: number;
    userTitle: string;
    avatarUri: string | null;
    gender: string | null;
    weight: string | null;
    height: string | null;
    weightGoal: string | null;
    notificationsEnabled: boolean;
    setUserName: (name: string) => void;
    setUserLevel: (level: number) => void;
    setUserTitle: (title: string) => void;
    setAvatar: (uri: string | null) => void;
    updateProfile: (data: Partial<Pick<UserState, 'userName' | 'gender' | 'weight' | 'height' | 'weightGoal'>>) => void;
    setNotifications: (enabled: boolean) => void;
    toggleNotifications: () => void;
    resetStore: () => void;
}

const initialState = {
    userName: 'Jean Ramalho',
    userLevel: 5,
    userTitle: 'Explorador Nível 5',
    avatarUri: null,
    gender: null,
    weight: null,
    height: null,
    weightGoal: null,
    notificationsEnabled: false,
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            ...initialState,
            setUserName: (userName) => set({ userName }),
            setUserLevel: (userLevel) => set({ userLevel }),
            setUserTitle: (userTitle) => set({ userTitle }),
            setAvatar: (uri) => set({ avatarUri: uri }),
            updateProfile: (data) => set((state) => ({ ...state, ...data })),
            setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            resetStore: () => set(initialState),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
