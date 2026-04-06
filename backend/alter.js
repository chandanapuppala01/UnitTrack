import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'unittrack.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run("ALTER TABLE bills ADD COLUMN firebase_uid TEXT", (err) => {
  if (err) console.log("Column may already exist:", err.message);
  else console.log("Column added successfully");
});
