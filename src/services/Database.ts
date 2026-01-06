import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('growup.db');

export const initDatabase = async () => {
    try {
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        photo_path TEXT,
        sex TEXT,
        weight REAL,
        height REAL,
        weight_goal REAL,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS pillars (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT,
        display_order INTEGER
      );
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY NOT NULL,
        pillar_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        days_mask INTEGER,
        duration_minutes INTEGER,
        suggested_time TEXT,
        notification_minutes_before INTEGER,
        is_recurring INTEGER,
        weight INTEGER,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS executions (
        id INTEGER PRIMARY KEY NOT NULL,
        goal_id INTEGER,
        date TEXT NOT NULL,
        real_start_time TEXT,
        real_duration INTEGER,
        status TEXT,
        observation TEXT,
        created_at TEXT
      );
      CREATE TABLE IF NOT EXISTS finances (
        id INTEGER PRIMARY KEY NOT NULL,
        type TEXT,
        category TEXT,
        amount REAL,
        date TEXT,
        note TEXT,
        is_planned INTEGER,
        created_at TEXT
      );
      CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT,
        with_who TEXT,
        date_time TEXT,
        recurrence_rule TEXT,
        preparation TEXT,
        reminders TEXT,
        status TEXT
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const getDB = () => db;
