import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', '..', 'lab_reagent.db');

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDatabase(): void {
  const database = getDatabase();

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      real_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      department TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reagents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cas_number TEXT,
      category TEXT NOT NULL,
      specification TEXT,
      unit TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      min_quantity INTEGER NOT NULL DEFAULT 10,
      location TEXT,
      supplier TEXT,
      price REAL,
      status TEXT NOT NULL DEFAULT '正常',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reagent_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reagent_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      remark TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (reagent_id) REFERENCES reagents(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS hazard_chemicals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cas_number TEXT,
      hazard_class TEXT NOT NULL,
      un_number TEXT,
      risk_phrase TEXT,
      safety_phrase TEXT,
      storage_condition TEXT,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      location TEXT,
      supervisor TEXT,
      status TEXT NOT NULL DEFAULT '正常',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS hazard_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hazard_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      remark TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (hazard_id) REFERENCES hazard_chemicals(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS instruments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model TEXT,
      manufacturer TEXT,
      serial_number TEXT,
      category TEXT NOT NULL,
      location TEXT,
      status TEXT NOT NULL DEFAULT '正常',
      purchase_date TEXT,
      warranty_date TEXT,
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      instrument_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      purpose TEXT,
      status TEXT NOT NULL DEFAULT '待确认',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (instrument_id) REFERENCES instruments(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      procedure TEXT,
      result TEXT,
      conclusion TEXT,
      attachments TEXT,
      status TEXT NOT NULL DEFAULT '草稿',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}
