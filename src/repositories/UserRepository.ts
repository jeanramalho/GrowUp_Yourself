import { SQLiteDatabase } from 'expo-sqlite';
import { Repository } from './Repository';
import { UserProfile } from '@/models';

export class UserRepository extends Repository<UserProfile> {
    constructor(db: SQLiteDatabase) {
        super(db, 'user_profile');
    }

    /**
     * Retrieves the current user profile.
     * Since this is a personal app, we assume there's only one user (ID 'current_user').
     */
    async getProfile(): Promise<UserProfile | null> {
        const sql = `SELECT * FROM ${this.tableName} LIMIT 1`;
        const results = await this.executeQuery<UserProfile>(sql);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Saves or updates the user profile.
     */
    async saveProfile(profile: UserProfile): Promise<UserProfile> {
        const existing = await this.getProfile();
        if (existing) {
            return this.update(existing.id, profile);
        } else {
            return this.create(profile);
        }
    }

    /**
     * Specifically update the avatar path
     */
    async updateAvatar(path: string | null): Promise<void> {
        const profile = await this.getProfile();
        if (profile) {
            await this.update(profile.id, {
                foto_path: path,
                updated_at: new Date().toISOString()
            });
        } else {
            // Create a default if it doesn't exist? 
            // Better handled by the store ensuring profile exists.
            await this.create({
                id: 'current_user',
                nome: 'Usuário',
                foto_path: path,
                updated_at: new Date().toISOString()
            });
        }
    }
}
