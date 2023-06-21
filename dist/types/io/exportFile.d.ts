/**
 * Export files from DuckDB.
 */
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * Export a table (or view) to an Arrow file with a given filename.
 */
export declare const exportArrow: (db: AsyncDuckDB, tableName: string, filename?: string) => Promise<File>;
/**
 * Export a given table (or view) to a CSV file with a given filename.
 */
export declare const exportCsv: (db: AsyncDuckDB, tableName: string, filename?: string, delimiter?: string) => Promise<File>;
/**
 * Export a table to Parquet.
 *
 * Uses zstd compression by default, which seems to be both smaller & faster for many files.
 */
export declare const exportParquet: (db: AsyncDuckDB, tableName: string, filename?: string, compression?: "uncompressed" | "snappy" | "gzip" | "zstd") => Promise<File>;
