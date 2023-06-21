import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { Table as Arrow } from "apache-arrow";
/**
 * Execute a SQL query, and return the result as an Apache Arrow table.
 */
export declare const runQuery: (db: AsyncDuckDB, sql: string) => Promise<Arrow>;
