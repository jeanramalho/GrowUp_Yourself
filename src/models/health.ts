/**
 * Health module data models
 */

/**
 * Health Profile
 * Stores user's physical attributes and check-in history
 */
export interface HealthProfile {
    id: string; // 'current_user'
    weight?: number | null; // legacy field (peso used in implementation)
    height?: number | null; // legacy field (altura used in implementation)
    peso?: number | null; // in kg
    altura?: number | null; // in cm
    meta_peso?: number | null; // in kg
    data_nascimento?: string | null; // YYYY-MM-DD
    gender?: 'male' | 'female' | 'other' | null;
    sexo?: 'male' | 'female' | 'other' | null; // legacy/unified
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
    waterGoal?: number | null; // in ml
    last_monthly_checkin?: string | null; // ISO string
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
 * Exercise Report
 */
export interface ExerciseReport {
    id: string;
    exercises: string;
    duration: number; // minutes
    calories: number;
    date: string; // YYYY-MM-DD
    created_at: string;
}

/**
 * Health Exam
 */
export interface HealthExam {
    id: string;
    filename: string;
    analysis: string;
    date: string; // YYYY-MM-DD
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
        actionType?: 'update_weight' | 'log_water' | 'set_goal' | 'exercise_report' | 'health_metrics' | 'analyze_exam' | 'weekly_diet' | 'monthly_checkin';
        actionValue?: any;
        relatedId?: string;
        options?: { label: string; value: any }[]; // For Sim/Não buttons
    };
}

/**
 * Health Goal
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

