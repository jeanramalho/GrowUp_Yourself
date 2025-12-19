export type Meta = {
  id?: string;
  title: string;
  description?: string;
  days: number[]; // 1..7
  durationMinutes: number;
  suggestedTime?: string; // HH:MM
  notifyBeforeMinutes?: number;
  recurring?: boolean;
  pillar?: 'spiritual' | 'health' | 'finance' | 'relationship';
};
