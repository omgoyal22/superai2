import * as duckdb from '@duckdb/duckdb-wasm';
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';

let db: AsyncDuckDB | null = null;

export async function initializeDuckDB() {
  if (db) return db;

  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
  const worker = new Worker('/worker/npm/@duckdb/duckdb-wasm@1.29.0/dist/duckdb-browser-eh.worker.js');
  const logger = new duckdb.ConsoleLogger();

  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  return db;
}

export async function queryDatabase(query: string) {
  if (!db) throw new Error('Database not initialized');
  
  const conn = await db.connect();
  try {
    const result = await conn.query(query);
    return result.toArray();
  } finally {
    await conn.close();
  }
}

export async function loadCSV(file: File) {
  if (!db) throw new Error('Database not initialized');
  
  const conn = await db.connect();
  try {
    const tableName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
    const content = await file.arrayBuffer();
    await db.registerFileBuffer(file.name, new Uint8Array(content));
    const result = await conn.query(`SELECT * FROM read_csv_auto('${file.name}', ignore_errors=true) LIMIT 1`);
    const columnNames = Object.keys(result.toArray()[0]).map(column => `"${column}"`).join(", ");
    await conn.query(`CREATE TABLE ${tableName} AS SELECT ${columnNames} FROM read_csv_auto('${file.name}', ignore_errors=true)`);
    const schema = await conn.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`);
    return { tableName, schema: schema.toArray() };
  } finally {
    await conn.close();
  }
}