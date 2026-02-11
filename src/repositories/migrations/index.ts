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
      migration003FinanceEnhancements,
      migration005PlanningOverhaul,
      migration006AddCompromissoAllDay,
      migration007HealthInit,
      migration008HealthEnhancements,
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
 * Finance enhancements migration - adds accounts and credit cards
 */
export const migration003FinanceEnhancements: Migration = {
  version: 3,
  name: '003_finance_enhancements',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      // Create conta table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS conta (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          tipo TEXT NOT NULL, -- 'carteira', 'vale_alimentacao', 'vale_refeicao'
          saldo_inicial REAL NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        )`
      );

      // Create cartao_credito table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS cartao_credito (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          descricao TEXT,
          limite REAL NOT NULL,
          dia_fechamento INTEGER NOT NULL,
          dia_vencimento INTEGER NOT NULL,
          created_at TEXT NOT NULL
        )`
      );

      // Update lancamento_financeiro
      await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN conta_id TEXT`);
      await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN cartao_id TEXT`);
      await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN parcelas_total INTEGER DEFAULT 1`);
      await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN parcela_atual INTEGER DEFAULT 1`);
      await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN id_grupo_parcela TEXT`);

      // Seed initial wallet if doesn't exist
      await db.runAsync(
        `INSERT OR IGNORE INTO conta (id, nome, tipo, saldo_inicial, created_at) VALUES (?, ?, ?, ?, ?)`,
        ['conta-1', 'Carteira Principal', 'carteira', 0, new Date().toISOString()]
      );

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [3, '003_finance_enhancements', new Date().toISOString()]
      );
    });
  },
};

/**
 * Planning Overhaul migration - New Category System + Planning Items
 */
export const migration005PlanningOverhaul: Migration = {
  version: 5,
  name: '005_planning_overhaul',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      // Create categoria_financeira table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS categoria_financeira (
          id TEXT PRIMARY KEY,
          nome TEXT NOT NULL,
          icone TEXT NOT NULL,
          cor TEXT NOT NULL,
          tipo TEXT NOT NULL, -- 'receita' or 'despesa'
          is_permanente INTEGER NOT NULL DEFAULT 1,
          arquivada INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        )`
      );

      // Add new columns to lancamento_financeiro
      try {
        await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN categoria_id TEXT`);
      } catch (e) { /* Ignore if exists */ }

      try {
        await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN status TEXT DEFAULT 'pendente'`);
      } catch (e) { /* Ignore if exists */ }

      try {
        await db.runAsync(`ALTER TABLE lancamento_financeiro ADD COLUMN recorrencia_id TEXT`);
      } catch (e) { /* Ignore if exists */ }

      // Seed defaults for the New System if empty
      const count = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) as c FROM categoria_financeira`);
      if ((count?.c || 0) === 0) {
        const defaultCats = [
          { name: 'Moradia', icon: 'home', color: '#EF4444' },
          { name: 'Alimentação', icon: 'food', color: '#F59E0B' },
          { name: 'Transporte', icon: 'car', color: '#3B82F6' },
          { name: 'Lazer', icon: 'gamepad-variant', color: '#8B5CF6' },
          { name: 'Saúde', icon: 'medical-bag', color: '#10B981' },
          { name: 'Outros', icon: 'tag-outline', color: '#6B7280' },
          { name: 'Salário', icon: 'cash', color: '#10B981', type: 'receita' }
        ];

        for (const cat of defaultCats) {
          const id = `cat-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          await db.runAsync(
            `INSERT OR IGNORE INTO categoria_financeira (id, nome, icone, cor, tipo, is_permanente, arquivada, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, cat.name, cat.icon, cat.color, (cat as any).type || 'despesa', 1, 0, new Date().toISOString()]
          );
        }
      }

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [5, '005_planning_overhaul', new Date().toISOString()]
      );
    });
  },
};

/**
 * Add is_all_day to compromisso
 */
export const migration006AddCompromissoAllDay: Migration = {
  version: 6,
  name: '006_add_compromisso_all_day',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      try {
        await db.runAsync(`ALTER TABLE compromisso ADD COLUMN is_all_day INTEGER DEFAULT 0`);
      } catch (e) { /* Ignore if exists */ }

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [6, '006_add_compromisso_all_day', new Date().toISOString()]
      );
    });
  },
};

/**
 * Health module initialization migration
 */
export const migration007HealthInit: Migration = {
  version: 7,
  name: '007_health_init',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      // Create health_profile table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS health_profile (
          id TEXT PRIMARY KEY,
          weight REAL,
          height REAL,
          birthDate TEXT,
          gender TEXT,
          activityLevel TEXT,
          waterGoal REAL,
          updated_at TEXT NOT NULL
        )`
      );

      // Create health_metrics table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS health_metrics (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          value REAL NOT NULL,
          unit TEXT NOT NULL,
          date TEXT NOT NULL,
          notes TEXT,
          created_at TEXT NOT NULL
        )`
      );

      // Create health_chat_history table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS health_chat_history (
          id TEXT PRIMARY KEY,
          text TEXT NOT NULL,
          sender TEXT NOT NULL, -- 'user' or 'ai'
          timestamp TEXT NOT NULL,
          type TEXT NOT NULL, -- 'text' or 'action'
          metadata TEXT
        )`
      );

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [7, '007_health_init', new Date().toISOString()]
      );
    });
  },
};

/**
 * Health enhancements migration - Exercise reports, Exams, and Profile updates
 */
export const migration008HealthEnhancements: Migration = {
  version: 8,
  name: '008_health_enhancements',
  up: async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      // Add columns to health_profile
      try {
        await db.runAsync(`ALTER TABLE health_profile ADD COLUMN meta_peso REAL`);
      } catch (e) { /* Ignore if exists */ }

      try {
        await db.runAsync(`ALTER TABLE health_profile ADD COLUMN last_monthly_checkin TEXT`);
      } catch (e) { /* Ignore if exists */ }

      // Create health_exercise_reports table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS health_exercise_reports (
          id TEXT PRIMARY KEY,
          exercises TEXT NOT NULL,
          duration INTEGER NOT NULL,
          calories REAL NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`
      );

      // Create health_exams table
      await db.runAsync(
        `CREATE TABLE IF NOT EXISTS health_exams (
          id TEXT PRIMARY KEY,
          filename TEXT NOT NULL,
          analysis TEXT NOT NULL,
          date TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`
      );

      // Record this migration
      await db.runAsync(
        `INSERT OR IGNORE INTO schema_version (version, name, applied_at) VALUES (?, ?, ?)`,
        [8, '008_health_enhancements', new Date().toISOString()]
      );
    });
  },
};
