import { AsyncDuckDB, DuckDBConfig } from "@duckdb/duckdb-wasm";
export declare let DEBUG: boolean | undefined;
/**
 * Initialize DuckDB, ensuring we only initialize it once.
 *
 * @param debug If true, log DuckDB logs and elapsed times to the console.
 * @param config An optional DuckDBConfig object.
 */
export default function initializeDuckDb(options?: {
    debug: boolean;
    config?: DuckDBConfig;
}): Promise<AsyncDuckDB>;
/**
 * Get the instance of DuckDB, initializing it if needed.
 *
 * Typically `useDuckDB` is used in React components instead, but this
 * method provides access outside of React contexts.
 */
export declare const getDuckDB: () => Promise<AsyncDuckDB>;
