import { Repository } from './Repository';
import { HealthProfile, HealthMetric, ChatMessage, ExerciseReport, HealthExam } from '../models/health';
import { SQLiteDatabase } from 'expo-sqlite';

export class HealthRepository extends Repository<any> { // Using any for base because we handle multiple tables
    constructor(db: SQLiteDatabase) {
        super(db, 'health_profile'); // Default table, but we'll override for specific calls
    }

    // --- Profile ---
    async getProfile(): Promise<HealthProfile | null> {
        const sql = `SELECT * FROM health_profile LIMIT 1`;
        const results = await this.executeQuery<any>(sql);
        if (results.length === 0) return null;

        const row = results[0];
        // Ensure both naming conventions are present
        return {
            ...row,
            peso: row.weight,
            altura: row.height,
            sexo: row.gender,
            data_nascimento: row.birthDate || row.data_nascimento
        };
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
        const sql = `
            INSERT INTO health_profile (id, weight, height, birthDate, gender, activityLevel, waterGoal, updated_at, meta_peso, last_monthly_checkin)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const weight = profile.weight ?? profile.peso ?? null;
        const height = profile.height ?? profile.altura ?? null;
        const gender = profile.gender ?? profile.sexo ?? null;

        await this.executeStatement(sql, [
            profile.id,
            weight,
            height,
            profile.data_nascimento || null,
            gender,
            profile.activityLevel || null,
            profile.waterGoal || null,
            profile.updated_at,
            profile.meta_peso || null,
            profile.last_monthly_checkin || null
        ]);
        return { ...profile, weight, height, gender };
    }

    async updateProfile(id: string, profile: Partial<HealthProfile>): Promise<HealthProfile> {
        const sql = `
            UPDATE health_profile 
            SET weight = ?, height = ?, birthDate = ?, gender = ?, activityLevel = ?, waterGoal = ?, updated_at = ?, meta_peso = ?, last_monthly_checkin = ?
            WHERE id = ?
        `;
        const existing = await this.getProfile();
        if (!existing) throw new Error('Profile not found');

        const merged = { ...existing, ...profile, updated_at: new Date().toISOString() };

        const weight = merged.weight ?? merged.peso ?? null;
        const height = merged.height ?? merged.altura ?? null;
        const gender = merged.gender ?? merged.sexo ?? null;

        await this.executeStatement(sql, [
            weight,
            height,
            merged.data_nascimento || null,
            gender,
            merged.activityLevel || null,
            merged.waterGoal || null,
            merged.updated_at,
            merged.meta_peso || null,
            merged.last_monthly_checkin || null,
            id
        ]);
        return { ...merged, weight, height, gender };
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

    // --- Exercise Reports ---
    async saveExerciseReport(report: ExerciseReport): Promise<ExerciseReport> {
        const sql = `
            INSERT INTO health_exercise_reports (id, exercises, duration, calories, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await this.executeStatement(sql, [
            report.id,
            report.exercises,
            report.duration,
            report.calories,
            report.date,
            report.created_at
        ]);
        return report;
    }

    async getExerciseReports(limit: number = 20): Promise<ExerciseReport[]> {
        const sql = `SELECT * FROM health_exercise_reports ORDER BY date DESC LIMIT ?`;
        return this.executeQuery<ExerciseReport>(sql, [limit]);
    }

    // --- Health Exams ---
    async saveExam(exam: HealthExam): Promise<HealthExam> {
        const sql = `
            INSERT INTO health_exams (id, filename, analysis, date, created_at)
            VALUES (?, ?, ?, ?, ?)
        `;
        await this.executeStatement(sql, [
            exam.id,
            exam.filename,
            exam.analysis,
            exam.date,
            exam.created_at
        ]);
        return exam;
    }

    async getExams(limit: number = 10): Promise<HealthExam[]> {
        const sql = `SELECT * FROM health_exams ORDER BY date DESC LIMIT ?`;
        return this.executeQuery<HealthExam>(sql, [limit]);
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
