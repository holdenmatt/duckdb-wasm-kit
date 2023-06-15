import { AsyncDuckDB, DuckDBConfig } from "@duckdb/duckdb-wasm";
export declare let DEBUG: boolean | undefined;
/**
 * Initialize DuckDB, while ensuring we only initialize once.
 *
 * @param debug If true, log elapsed times to the console.
 * @param config An optional DuckDBConfig object.
 */
export default function initializeDuckDb({ debug, config, includeJson, }: {
    debug: boolean;
    config?: DuckDBConfig;
    includeJson?: boolean;
}): Promise<AsyncDuckDB>;
/**
 * Get the instance of DuckDB that has been previously initialized.
 *
 * Typically `useDuckDB` is used in React components instead, but this
 * method provides access outside of React contexts.
 */
export declare const getDuckDB: () => Promise<AsyncDuckDB>;
