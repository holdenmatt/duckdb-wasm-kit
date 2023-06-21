import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB, DuckDBConfig } from "@duckdb/duckdb-wasm";

import { logElapsedTime } from "../util/perf";

export let DEBUG: boolean | undefined;

let DB: Promise<AsyncDuckDB> | undefined;

/**
 * Initialize DuckDB, while ensuring we only initialize once.
 *
 * @param debug If true, log DuckDB logs and elapsed times to the console.
 * @param config An optional DuckDBConfig object.
 */
export default async function initializeDuckDb({
  debug = false,
  config,
}: {
  debug: boolean;
  config?: DuckDBConfig;
}): Promise<AsyncDuckDB> {
  DEBUG = debug;

  if (DB === undefined) {
    DB = _initializeDuckDb(config);
  }
  return DB;
}

/**
 * Initialize DuckDB with a browser-specific Wasm bundle.
 */
const _initializeDuckDb = async (
  config?: DuckDBConfig
): Promise<AsyncDuckDB> => {
  const start = performance.now();

  // Select a bundle based on browser checks
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {
      type: "text/javascript",
    })
  );

  // Instantiate the async version of DuckDB-wasm
  const worker = new Worker(worker_url);
  const logger = DEBUG ? new duckdb.ConsoleLogger() : new duckdb.VoidLogger();
  const db = new AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  if (config) {
    await db.open(config);
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
