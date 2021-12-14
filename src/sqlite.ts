import sqlite3 from 'sqlite3';
import { get_candle_stick } from './binance.js';
import { Candle } from './models/candle.js';
import { Interval } from './models/utils.js';
import { get_candle_id } from './utils.js';

const sqlite = sqlite3.verbose();

const openDatabase = () => {
    const db = new sqlite.Database('./db/database.db');
    return db;
}

const createTables = (db: sqlite3.Database) => {
    db.serialize(() => {
        // table for candles
        db.run(`CREATE TABLE IF NOT EXISTS candles (
            id TEXT PRIMARY KEY,
            pair TEXT,
            openTime INTEGER,
            closeTime INTEGER,
            high TEXT,
            low TEXT,
            open TEXT,
            close TEXT,
            volume TEXT
        )`);
        // table for last candle of each pair
        db.run(`CREATE TABLE IF NOT EXISTS lastCandle (
            pair TEXT PRIMARY KEY,
            id TEXT
        )`);

    });
}

const retrieveCandles = (db: sqlite3.Database, pair: string, startTime: number, endTime: number) => {

    // AND openTime >= ? AND openTime <= ?
    return new Promise<Candle[]>((resolve, reject) => {
        db.all(`SELECT * FROM candles WHERE pair = ?;`, [pair/*, startTime, endTime*/], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    })
}

const refreshDataCandle = async (db: sqlite3.Database, pair: string = 'BTCUSDT', duration: Interval = '5m') => {
    const candles = await get_candle_stick(pair, duration);

    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO candles VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        candles.forEach(candle => {
            stmt.run(get_candle_id(candle, pair), pair, candle.openTime, candle.closeTime, candle.high, candle.low, candle.open, candle.close, candle.volume);
        })
        stmt.finalize();

        // update last candle id
        db.run(`INSERT OR REPLACE INTO lastCandle VALUES (?, ?)`, [pair, get_candle_id(candles[candles.length - 1], pair)]);
    });
}

export {
    openDatabase,
    createTables,
    retrieveCandles,
    refreshDataCandle
}