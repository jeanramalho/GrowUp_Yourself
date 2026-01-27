import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { database } from '@/repositories/Repository';
import { UserRepository } from '@/repositories/UserRepository';

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
    setAvatar: (path: string | null) => Promise<void>;
    getAvatarUri: () => string | null; // Helper to get full URI
    setProfileComplete: (complete: boolean) => void;
    updateProfile: (data: Partial<Pick<UserState, 'userName' | 'gender' | 'weight' | 'height' | 'weightGoal'>>) => Promise<void>;
    setNotifications: (enabled: boolean) => void;
    toggleNotifications: () => void;
    resetStore: () => void;
    loadFromDb: () => Promise<void>;
    saveToDb: () => Promise<void>;
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
            setUserName: (userName) => {
                set({ userName });
                get().saveToDb();
            },
            setUserLevel: (userLevel) => set({ userLevel }),
            setUserTitle: (userTitle) => set({ userTitle }),
            setAvatar: async (path) => {
                const oldPath = get().avatarPath;
                let filename: string | null = null;

                if (path) {
                    filename = path.split('/').pop() || null;
                }

                // Cleanup old avatar if it exists and changed
                if (oldPath && oldPath !== filename) {
                    try {
                        const oldUri = `${FileSystem.documentDirectory}${oldPath}`;
                        const info = await FileSystem.getInfoAsync(oldUri);
                        if (info.exists) {
                            await FileSystem.deleteAsync(oldUri, { idempotent: true });
                        }
                    } catch (e) {
                        console.error("Error cleaning up old avatar:", e);
                    }
                }

                set({ avatarPath: filename });
                await get().saveToDb();
            },
            getAvatarUri: () => {
                const { avatarPath } = get();
                if (!avatarPath) return null;
                return `${FileSystem.documentDirectory}${avatarPath}`;
            },
            setProfileComplete: (isProfileComplete) => set({ isProfileComplete }),
            updateProfile: async (data) => {
                set((state) => ({ ...state, ...data }));
                await get().saveToDb();
            },
            setNotifications: (enabled) => set({ notificationsEnabled: enabled }),
            toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            resetStore: () => set(initialState),
            loadFromDb: async () => {
                try {
                    const db = database.getDb();
                    const userRepo = new UserRepository(db);
                    const profile = await userRepo.getProfile();
                    if (profile) {
                        set({
                            userName: profile.nome,
                            avatarPath: profile.foto_path || null,
                            gender: profile.sexo === 'male' ? 'Masculino' : (profile.sexo === 'female' ? 'Feminino' : null),
                            weight: profile.peso?.toString() || null,
                            height: profile.altura?.toString() || null,
                            weightGoal: profile.meta_peso?.toString() || null,
                            isProfileComplete: true,
                        });
                    }
                } catch (error) {
                    console.error("Error loading user from DB:", error);
                }
            },
            saveToDb: async () => {
                try {
                    const state = get();
                    const db = database.getDb();
                    const userRepo = new UserRepository(db);
                    await userRepo.saveProfile({
                        id: 'current_user',
                        nome: state.userName,
                        foto_path: state.avatarPath,
                        sexo: state.gender === 'Masculino' ? 'male' : (state.gender === 'Feminino' ? 'female' : 'other'),
                        peso: state.weight ? parseFloat(state.weight) : null,
                        altura: state.height ? parseFloat(state.height) : null,
                        meta_peso: state.weightGoal ? parseFloat(state.weightGoal) : null,
                        updated_at: new Date().toISOString(),
                    });
                } catch (error) {
                    console.error("Error saving user to DB:", error);
                }
            },
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
