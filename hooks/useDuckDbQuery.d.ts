import { Table as Arrow } from "apache-arrow";
/**
 * Execute a SQL query and return the result as Arrow.
 *
 * Wait for DuckDB to initialize if necessary.
 *
 * If sql is undefined, returns undefined.
 */
export declare const useDuckDbQuery: (sql: string | undefined) => {
    arrow: Arrow | undefined;
    loading: boolean;
    error: Error | undefined;
};
