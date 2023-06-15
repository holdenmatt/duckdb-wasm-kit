import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB, DuckDBConfig } from "@duckdb/duckdb-wasm";

import { logElapsedTime } from "../util/perf";
import { runQuery } from "../util/runQuery";

export let DEBUG: boolean | undefined;

let DB: Promise<AsyncDuckDB> | undefined;

/**
 * Initialize DuckDB, while ensuring we only initialize once.
 *
 * @param debug If true, log elapsed times to the console.
 * @param config An optional DuckDBConfig object.
 */
export default async function initializeDuckDb({
  debug = false,
  config,
  includeJson = false,
}: {
  debug: boolean;
  config?: DuckDBConfig;
  includeJson?: boolean;
}): Promise<AsyncDuckDB> {
  DEBUG = debug;

  if (DB === undefined) {
    DB = _initializeDuckDb(config, includeJson);
  }
  return DB;
}

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: "/wasm/duckdb-mvp.wasm",
    mainWorker: "/wasm/duckdb-browser-mvp.worker.js",
  },
  eh: {
    mainModule: "/wasm/duckdb-eh.wasm",
    mainWorker: "/wasm/duckdb-browser-eh.worker.js",
  },
};

/**
 * Initialize DuckDB with a browser-specific Wasm bundle.
 */
const _initializeDuckDb = async (
  config?: DuckDBConfig,
  includeJson?: boolean
): Promise<AsyncDuckDB> => {
  const start = performance.now();

  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

  // Instantiate the async version of DuckDB-wasm
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  const db = new AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  if (config) {
    await db.open(config);
  }

  if (includeJson) {
    const jsonUrl = ".../json.extension.wasm";
    await runQuery(db, `LOAD "${jsonUrl}"`);
  }

  DEBUG && logElapsedTime("DuckDB initialized", start);
  return db;
};

/**
 * Get the instance of DuckDB that has been previously initialized.
 *
 * Typically `useDuckDB` is used in React components instead, but this
 * method provides access outside of React contexts.
 */
export const getDuckDB = (): Promise<AsyncDuckDB> => {
  if (DB) {
    return DB;
  } else {
    throw new Error("DuckDB must be initialized before calling `getDuckDB`");
  }
};
