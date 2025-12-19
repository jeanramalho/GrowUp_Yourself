import Database from 'better-sqlite3';
import * as FileSystem from 'expo-file-system';
import path from 'path';

/**
 * SQLite Repository Abstraction
 * Provides a simple interface for database operations.
 * Supports both better-sqlite3 (Node) and expo-sqlite (React Native).
 */

let db: Database.Database | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    const dbPath = `${FileSystem.documentDirectory}growup.db`;
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    console.log('Database initialized at:', dbPath);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getDatabase = (): Database.Database => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

export const executeQuery = (sql: string, params: any[] = []): any => {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params);
};

export const executeUpdate = (sql: string, params: any[] = []): any => {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.run(...params);
};

export const executeTransaction = (callback: () => void): void => {
  const database = getDatabase();
  const transaction = database.transaction(callback);
  transaction();
};

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
  }
};
