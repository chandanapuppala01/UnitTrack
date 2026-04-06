import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'unittrack.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Bills table
    db.run(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        units REAL NOT NULL,
        peak_demand REAL,
        billing_month TEXT NOT NULL,
        provider TEXT,
        firebase_uid TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating bills table', err.message);
      } else {
        // Seed initial data if empty
        db.get('SELECT COUNT(*) as count FROM bills', (err, row) => {
          if (row.count === 0) {
            console.log('Seeding initial data...');
            const stmt = db.prepare('INSERT INTO bills (units, peak_demand, billing_month, provider, firebase_uid) VALUES (?, ?, ?, ?, ?)');
            // Note: Seed data won't show up for real authenticated users unless they happen to get the 'mock_user' UID, 
            // but we add it to prevent schema errors.
            stmt.run(320, 4.5, 'January 2026', 'PG&E', 'mock_user');
            stmt.run(280, 3.8, 'February 2026', 'PG&E', 'mock_user');
            stmt.run(340, 5.2, 'March 2026', 'PG&E', 'mock_user');
            stmt.finalize();
          }
        });
      }
    });
  }
});

// Helper wrapper for async queries
export const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default db;
