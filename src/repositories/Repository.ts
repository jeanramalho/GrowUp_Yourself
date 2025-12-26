/**
 * Repository abstraction for database access
 * Provides a generic CRUD interface that can be swapped between SQLite and cloud backends
 */

import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Generic Repository interface for CRUD operations
 * Enables future migration to cloud storage
 */
export interface IRepository<T> {
  create(item: T): Promise<T>;
  read(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  list(): Promise<T[]>;
  query(predicate: (item: T) => boolean): Promise<T[]>;
}

/**
 * Base Repository class that wraps SQLite database
 * Subclasses implement specific table operations
 */
export class Repository<T extends { id: string }> implements IRepository<T> {
  protected db: SQLiteDatabase;
  protected tableName: string;

  constructor(db: SQLiteDatabase, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  /**
   * Execute a raw SQL query
   */
  protected async executeQuery<R>(sql: string, params: any[] = []): Promise<R[]> {
    try {
      let result: R[] = [];
      await this.db.transactionAsync(async (tx) => {
        const resultSet = await tx.executeSqlAsync(sql, params);
        result = (resultSet.rows as unknown as R[]) || [];
      }, true); // true = readOnly
      return result;
    } catch (error) {
      console.error(`Query error in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Execute a single SQL statement
   */
  protected async executeStatement(sql: string, params: any[] = []): Promise<void> {
    try {
      await this.db.transactionAsync(async (tx) => {
        await tx.executeSqlAsync(sql, params);
      }, false); // false = not readOnly
    } catch (error) {
      console.error(`Execute error in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create(item: T): Promise<T> {
    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(', ');
    const columnNames = keys.join(', ');

    const sql = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders})`;

    await this.executeStatement(sql, values);
    return item;
  }

  /**
   * Read a single record by ID
   */
  async read(id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.executeQuery<T>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update a record
   */
  async update(id: string, item: Partial<T>): Promise<T> {
    const keys = Object.keys(item);
    const values = Object.values(item);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

    await this.executeStatement(sql, [...values, id]);

    const updated = await this.read(id);
    if (!updated) {
      throw new Error(`Record with id ${id} not found after update`);
    }
    return updated;
  }

  /**
   * Delete a record
   */
  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

    await this.executeStatement(sql, [id]);
    return true;
  }

  /**
   * List all records
   */
  async list(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    return this.executeQuery<T>(sql);
  }

  /**
   * Query records with a predicate function
   * Note: This is an in-memory filter. For large datasets, override to use SQL WHERE clause
   */
  async query(predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.list();
    return all.filter(predicate);
  }

  /**
   * Check if table exists
   */
  protected async tableExists(): Promise<boolean> {
    const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
    const results = await this.executeQuery<{ name: string }>(sql, [this.tableName]);
    return results.length > 0;
  }
}

/**
 * Database wrapper that manages SQLite instance and provides repository factory
 */
export class Database {
  private db: SQLiteDatabase | null = null;

  /**
   * Initialize the database connection
   */
  async initialize(dbInstance: SQLiteDatabase): Promise<void> {
    this.db = dbInstance;
    // Enable foreign keys
    await this.db.execAsync([{ sql: 'PRAGMA foreign_keys = ON', args: [] }], false);
  }

  /**
   * Get the SQLite database instance
   */
  getDb(): SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Create a repository for a specific table
   */
  createRepository<T extends { id: string }>(tableName: string): Repository<T> {
    const db = this.getDb();
    return new Repository<T>(db, tableName);
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}
