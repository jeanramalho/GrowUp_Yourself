/**
 * Health module data models
 */

/**
 * Health Profile
 * Stores user's physical attributes
 */
export interface HealthProfile {
    id: string; // usually 'default' or tied to user_id
    weight: number; // in kg
    height: number; // in cm
    birthDate?: string; // YYYY-MM-DD
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    waterGoal: number; // in ml
    updated_at: string;
}

/**
 * Health Metric/Exam
 * Stores historical data like weight logs, blood pressure, etc.
 */
export interface HealthMetric {
    id: string;
    type: 'weight' | 'height' | 'bmi' | 'body_fat' | 'blood_pressure' | 'glucose' | 'other';
    value: number;
    unit: string;
    date: string; // YYYY-MM-DD
    notes?: string;
    created_at: string;
}

/**
 * Chat Message
 * Structure for the offline AI chat history
 */
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string; // ISO string
    type: 'text' | 'action' | 'system';
    metadata?: {
        actionType?: 'update_weight' | 'log_water' | 'set_goal';
        actionValue?: any;
        relatedId?: string;
    };
}

/**
 * Health Goal (extends the generic Meta but specific for Health context if needed)
 * For now we can reuse Meta from index.ts, but we might want specific health targets
 */
export interface HealthGoal {
    id: string;
    type: 'water' | 'exercise' | 'calories' | 'sleep' | 'custom';
    targetValue: number;
    currentValue: number;
    unit: string;
    frequency: 'daily' | 'weekly';
    startDate: string;
    endDate?: string;
    isActive: boolean;
}
