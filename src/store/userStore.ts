import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface UserState {
    userName: string;
    userLevel: number;
    userTitle: string;
    avatarPath: string | null; // Changed from avatarUri to avatarPath (filename only)
    gender: string | null;
    weight: string | null;
    height: string | null;
    weightGoal: string | null;
    notificationsEnabled: boolean;
    isProfileComplete: boolean;
    setUserName: (name: string) => void;
    setUserLevel: (level: number) => void;
    setUserTitle: (title: string) => void;
    setAvatar: (path: string | null) => void;
    getAvatarUri: () => string | null; // Helper to get full URI
    setProfileComplete: (complete: boolean) => void;
    updateProfile: (data: Partial<Pick<UserState, 'userName' | 'gender' | 'weight' | 'height' | 'weightGoal'>>) => void;
    setNotifications: (enabled: boolean) => void;
    toggleNotifications: () => void;
    resetStore: () => void;
}

const initialState = {
    userName: '',
    userLevel: 1,
    userTitle: 'Novo Usuário',
    avatarPath: null,
    gender: null,
    weight: null,
    height: null,
    weightGoal: null,
    notificationsEnabled: false,
    isProfileComplete: false,
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            ...initialState,
            setUserName: (userName) => set({ userName }),
            setUserLevel: (userLevel) => set({ userLevel }),
            setUserTitle: (userTitle) => set({ userTitle }),
            setAvatar: (path) => {
                // If path is absolute (contains documentDirectory), strip it
                if (path && path.startsWith(FileSystem.documentDirectory || '')) {
                    const filename = path.split('/').pop();
                    set({ avatarPath: filename || null });
                } else if (path) {
                    // If it's already a filename or other path
                    const filename = path.split('/').pop();
                    set({ avatarPath: filename || null });
                } else {
                    set({ avatarPath: null });
                }
            },
            getAvatarUri: () => {
                const { avatarPath } = get();
                if (!avatarPath) return null;
                return `${FileSystem.documentDirectory}${avatarPath}`;
            },
            setProfileComplete: (isProfileComplete) => set({ isProfileComplete }),
            updateProfile: (data) => set((state) => ({ ...state, ...data })),
            setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            resetStore: () => set(initialState),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                userName: state.userName,
                userLevel: state.userLevel,
                userTitle: state.userTitle,
                avatarPath: state.avatarPath, // Persist clean filename
                gender: state.gender,
                weight: state.weight,
                height: state.height,
                weightGoal: state.weightGoal,
                notificationsEnabled: state.notificationsEnabled,
                isProfileComplete: state.isProfileComplete,
            }),
        }
    )
);
