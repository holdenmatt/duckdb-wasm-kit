import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * Given a Parquet, Arrow, or CSV file, convert it to Parquet.
 *
 * TODO: Remove this (move it elsewhere).
 */
export declare function toParquet(db: AsyncDuckDB, file: File): Promise<File>;
