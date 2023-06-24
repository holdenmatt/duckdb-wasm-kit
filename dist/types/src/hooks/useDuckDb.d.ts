import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * React hook to access the DuckDb instance from an enclosing DuckDbProvider.
 */
export declare const useDuckDb: () => AsyncDuckDB | undefined;
