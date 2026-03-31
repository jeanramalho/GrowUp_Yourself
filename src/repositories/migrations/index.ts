/**
 * Database initialization and migration system
 * Handles schema creation and data seeding
 */

import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Migration interface
 */
export interface Migration {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
  down?: (db: SQLiteDatabase) => Promise<void>;
}

/**
 * Initial schema migration - creates all tables
 */
export const migration001Init: Migration = {
  version: 1,
  name: '001_init',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      // Create user_profile table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS user_profile (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          foto_path TEXT,
          sexo TEXT,
          peso REAL,
          altura REAL,
          meta_peso REAL,
          preferencias TEXT,
          updated_at TEXT NOT NULL
        )`
      );

      // Create pilar table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS pilar (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          icone TEXT,
          ordem INTEGER NOT NULL
        )`
      );

      // Create meta table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS meta (
          id TEXT PRIMARY KEY,
          pilar_id TEXT NOT NULL,
          titulo TEXT NOT NULL,
          descricao TEXT,
          dias_semana INTEGER NOT NULL,
          duracao_minutos INTEGER NOT NULL,
          horario_sugerido TEXT,
          notificacao_minutos_antes INTEGER,
          recorrente INTEGER NOT NULL DEFAULT 1,
          peso INTEGER,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (pilar_id) REFERENCES pilar(id)
        )`
      );

      await db.runAsync(`CREATE INDEX IF NOT EXISTS idx_meta_pilar ON meta(pilar_id)`);

      // Create execucao table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS execucao (
          id TEXT PRIMARY KEY,
          meta_id TEXT NOT NULL,
          data TEXT NOT NULL,
          horario_inicio_real TEXT,
          duracao_real INTEGER,
          status TEXT NOT NULL,
          observacao TEXT,
          created_at TEXT NOT NULL,
          FOREIGN KEY (meta_id) REFERENCES meta(id)
        )`
      );

      await db.runAsync(`CREATE INDEX IF NOT EXISTS idx_execucao_meta ON execucao(meta_id)`);

      // Create lancamento_financeiro table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS lancamento_financeiro (
          id TEXT PRIMARY KEY,
          tipo TEXT NOT NULL,
          categoria TEXT,
          valor REAL NOT NULL,
          data TEXT NOT NULL,
          nota TEXT,
          planejado INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        )`
      );

      // Create investimento table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS investimento (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          principal REAL NOT NULL,
          taxa_juros_ano REAL,
          data_inicio TEXT,
          notas TEXT
        )`
      );

      // Create compromisso table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS compromisso (
          id TEXT PRIMARY KEY,
          titulo TEXT NOT NULL,
          com_quem TEXT,
          data_hora TEXT NOT NULL,
          recorrencia_rule TEXT,
          preparacao TEXT,
          lembretes TEXT,
          status TEXT
        )`
      );

      // Create schema_version table to track migrations
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS schema_version (
          version INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          applied_at TEXT NOT NULL
        )`
      );

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [1, '001_init', new Date().toISOString()]
      );
    });
  },

  down: async (db: SQLiteDatabase) => {
    // Drop tables in reverse order of creation
    await db.withTransactionAsync(async () => {
      await db.runAsync('DROP TABLE IF EXISTS schema_version');
      await db.runAsync('DROP TABLE IF EXISTS compromisso');
      await db.runAsync('DROP TABLE IF EXISTS investimento');
      await db.runAsync('DROP TABLE IF EXISTS lancamento_financeiro');
      await db.runAsync('DROP TABLE IF EXISTS execucao');
      await db.runAsync('DROP TABLE IF EXISTS meta');
      await db.runAsync('DROP TABLE IF EXISTS pilar');
      await db.runAsync('DROP TABLE IF EXISTS user_profile');
    });
  },
};

/**
 * Seed data migration - populates initial pilares
 */
export const migration002SeedPilares: Migration = {
  version: 2,
  name: '002_seed_pilares',
  up: async (db: SQLiteDatabase) => {
    const pilares = [
      { id: 'pilar-1', nome: 'Espiritualidade', icone: 'meditation', ordem: 0 },
      { id: 'pilar-2', nome: 'Saúde', icone: 'heart', ordem: 1 },
      { id: 'pilar-3', nome: 'Finanças', icone: 'trending-up', ordem: 2 },
      { id: 'pilar-4', nome: 'Relacionamentos', icone: 'people', ordem: 3 },
    ];

    await db.withTransactionAsync(async () => {
      for (const pilar of pilares) {
        await db.runAsync(
          `INSERT OR IGNORE INTO pilar (id, nome, icone, ordem) VALUES (?, ?, ?, ?)`,
          [pilar.id, pilar.nome, pilar.icone, pilar.ordem]
        );
      }

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [2, '002_seed_pilares', new Date().toISOString()]
      );
    });
  },
};

/**
 * Migration runner
 */
export class MigrationRunner {
  private db: SQLiteDatabase;
  private migrations: Migration[] = [];

  constructor(db: SQLiteDatabase) {
    this.db = db;
    // Register all migrations
    this.migrations = [
      migration001Init,
      migration002SeedPilares,
    ];
  }

  /**
   * Get current schema version
   */
  private async getCurrentVersion(): Promise<number> {
    try {
      const result = await this.db.getFirstAsync<{ version: number }>(
        'SELECT MAX(version) as version FROM schema_version'
      );
      return result?.version ?? 0;
    } catch {
      return 0;
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    const currentVersion = await this.getCurrentVersion();

    for (const migration of this.migrations) {
      if (migration.version > currentVersion) {
        try {
          console.log(`Applying migration: ${migration.name}`);
          await migration.up(this.db);
          console.log(`Migration ${migration.name} applied successfully`);
        } catch (error) {
          console.error(`Migration ${migration.name} failed:`, error);
          throw error;
        }
      }
    }
  }

  /**
   * Rollback to a specific version
   */
  async rollback(targetVersion: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion();

    for (let i = this.migrations.length - 1; i >= 0; i--) {
      const migration = this.migrations[i];
      if (migration.version > targetVersion && migration.version <= currentVersion) {
        if (migration.down) {
          try {
            console.log(`Rolling back migration: ${migration.name}`);
            await migration.down(this.db);
            // Remove from schema_version
            await this.db.withTransactionAsync(async () => {
              await this.db.runAsync('DELETE FROM schema_version WHERE version = ?', [
                migration.version,
              ]);
            });
            console.log(`Migration ${migration.name} rolled back successfully`);
          } catch (error) {
            console.error(`Rollback of ${migration.name} failed:`, error);
            throw error;
          }
        }
      }
    }
  }
}
