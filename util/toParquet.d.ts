import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * Given a Parquet, Arrow, or CSV file, convert it to Parquet.
 */
export declare function toParquet(db: AsyncDuckDB, file: File): Promise<File>;
