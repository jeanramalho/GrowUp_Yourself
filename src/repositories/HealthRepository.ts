import { Repository } from './Repository';
import { HealthProfile, HealthMetric, ChatMessage } from '../models/health';
import { SQLiteDatabase } from 'expo-sqlite';

export class HealthRepository extends Repository<any> { // Using any for base because we handle multiple tables
    constructor(db: SQLiteDatabase) {
        super(db, 'health_profile'); // Default table, but we'll override for specific calls
    }

    // --- Profile ---
    async getProfile(): Promise<HealthProfile | null> {
        const sql = `SELECT * FROM health_profile LIMIT 1`;
        const results = await this.executeQuery<HealthProfile>(sql);
        return results.length > 0 ? results[0] : null;
    }

    async saveProfile(profile: HealthProfile): Promise<HealthProfile> {
        const existing = await this.getProfile();
        if (existing) {
            return await this.updateProfile(existing.id, profile);
        } else {
            return await this.createProfile(profile);
        }
    }

    async createProfile(profile: HealthProfile): Promise<HealthProfile> {
        // Implementation depends on Repository generic structure, assuming basic insert
        // Since we are bypassing generic create for specific table logic:
        const sql = `
            INSERT INTO health_profile (id, weight, height, birthDate, gender, activityLevel, waterGoal, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.executeStatement(sql, [
            profile.id,
            profile.weight,
            profile.height,
            profile.birthDate || null,
            profile.gender,
            profile.activityLevel,
            profile.waterGoal,
            profile.updated_at
        ]);
        return profile;
    }

    async updateProfile(id: string, profile: Partial<HealthProfile>): Promise<HealthProfile> {
        const sql = `
            UPDATE health_profile 
            SET weight = ?, height = ?, birthDate = ?, gender = ?, activityLevel = ?, waterGoal = ?, updated_at = ?
            WHERE id = ?
        `;
        // Need to fetch existing to merge if partial, but for now assuming full update or handled by service
        // Ideally repo handles the merge or service does. Let's assume service passes full object or we fetch here.
        // For simplicity, let's assume the service handles the object completeness or we just update fields provided.
        // But SQL update needs values. Let's do a smart update generator or just simple fixed fields for now.

        const existing = await this.getProfile();
        if (!existing) throw new Error('Profile not found');

        const merged = { ...existing, ...profile, updated_at: new Date().toISOString() };

        await this.executeStatement(sql, [
            merged.weight,
            merged.height,
            merged.birthDate || null,
            merged.gender,
            merged.activityLevel,
            merged.waterGoal,
            merged.updated_at,
            id
        ]);
        return merged;
    }

    // --- Metrics ---
    async addMetric(metric: HealthMetric): Promise<HealthMetric> {
        const sql = `
            INSERT INTO health_metrics (id, type, value, unit, date, notes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await this.executeStatement(sql, [
            metric.id,
            metric.type,
            metric.value,
            metric.unit,
            metric.date,
            metric.notes || null,
            metric.created_at
        ]);
        return metric;
    }

    async getMetrics(type: string, limit: number = 20): Promise<HealthMetric[]> {
        const sql = `SELECT * FROM health_metrics WHERE type = ? ORDER BY date DESC LIMIT ?`;
        return this.executeQuery<HealthMetric>(sql, [type, limit]);
    }

    // --- Chat History ---
    async saveMessage(message: ChatMessage): Promise<ChatMessage> {
        const sql = `
            INSERT INTO health_chat_history (id, text, sender, timestamp, type, metadata)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await this.executeStatement(sql, [
            message.id,
            message.text,
            message.sender,
            message.timestamp,
            message.type,
            message.metadata ? JSON.stringify(message.metadata) : null
        ]);
        return message;
    }

    async getChatHistory(limit: number = 50): Promise<ChatMessage[]> {
        const sql = `SELECT * FROM health_chat_history ORDER BY timestamp ASC LIMIT ?`; // Chat usually shown ASC by time, but we might want last N messages.
        // Actually usually we want last N messages but in ASC order.
        // So: SELECT * FROM (SELECT * FROM table ORDER BY timestamp DESC LIMIT N) ORDER BY timestamp ASC
        const innerSql = `SELECT * FROM health_chat_history ORDER BY timestamp DESC LIMIT ?`;
        const results = await this.executeQuery<any>(innerSql, [limit]);

        return results.map(row => ({
            ...row,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined
        })).reverse();
    }

    async clearChat(): Promise<void> {
        await this.executeStatement('DELETE FROM health_chat_history');
    }
}
