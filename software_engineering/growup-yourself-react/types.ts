
export enum PillarType {
  SPIRITUALITY = 'spirituality',
  HEALTH = 'health',
  FINANCE = 'finance',
  RELATIONSHIPS = 'relationships'
}

export interface PillarProgress {
  type: PillarType;
  progress: number; // 0 to 100
  color: string;
  icon: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  pillar: PillarType;
  completed: boolean;
  streak: number;
}

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

export interface RelationshipEvent {
  id: string;
  title: string;
  person: string;
  time: string;
  recurring: 'weekly' | 'monthly' | 'yearly';
}
