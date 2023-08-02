import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * React hook to access a singleton DuckDb instance within components or other hooks.
 */
export declare const useDuckDb: () => {
    db: AsyncDuckDB | undefined;
    loading: boolean;
    error: Error | undefined;
};
