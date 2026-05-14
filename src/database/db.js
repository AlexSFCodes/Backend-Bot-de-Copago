const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { insurancePlans, hospitalNetwork } = require('../data/insuranceData');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans_coverage (
      plan_id TEXT,
      specialty TEXT,
      co_pay REAL,
      discount REAL,
      PRIMARY KEY (plan_id, specialty),
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );

    CREATE TABLE IF NOT EXISTS hospitals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hospitals_costs (
      hospital_id TEXT,
      specialty TEXT,
      cost REAL,
      PRIMARY KEY (hospital_id, specialty),
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    );

    CREATE TABLE IF NOT EXISTS consultation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      symptom TEXT,
      specialty TEXT,
      plan_id TEXT,
      estimated_total REAL
    );
  `);

  seed();
};

const seed = () => {
  const planCount = db.prepare('SELECT COUNT(*) as count FROM plans').get().count;
  
  if (planCount === 0) {
    console.log('🌱 Seeding database...');

    const insertPlan = db.prepare('INSERT INTO plans (id, name) VALUES (?, ?)');
    const insertCoverage = db.prepare('INSERT INTO plans_coverage (plan_id, specialty, co_pay, discount) VALUES (?, ?, ?, ?)');
    const insertHospital = db.prepare('INSERT INTO hospitals (id, name, location) VALUES (?, ?, ?)');
    const insertCost = db.prepare('INSERT INTO hospitals_costs (hospital_id, specialty, cost) VALUES (?, ?, ?)');

    // Transaction for seeding
    const runSeeding = db.transaction(() => {
      // Seed plans
      insurancePlans.forEach(plan => {
        insertPlan.run(plan.id, plan.name);
        Object.entries(plan.coverage).forEach(([specialty, details]) => {
          insertCoverage.run(plan.id, specialty, details.coPay, details.discount);
        });
      });

      // Seed hospitals
      hospitalNetwork.forEach(hosp => {
        insertHospital.run(hosp.id, hosp.name, hosp.location);
        Object.entries(hosp.baseCosts).forEach(([specialty, cost]) => {
          insertCost.run(hosp.id, specialty, cost);
        });
      });
    });

    runSeeding();
    console.log('✅ Seeding complete.');
  }
};

initDb();

module.exports = db;
