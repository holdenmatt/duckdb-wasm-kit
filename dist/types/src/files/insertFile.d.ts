import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { Table as Arrow } from "apache-arrow";
export declare class InsertFileError extends Error {
    title: string;
    constructor(title: string, message: string);
}
/**
 * Insert a CSV, Arrow, or Parquet file in DuckDB.
 *
 * If successul, return the inserted table name. Otherwise, throw an error.
 *
 * @param debug Print the total elapsed time to the console.
 */
export declare const insertFile: (db: AsyncDuckDB, file: File, tableName?: string, debug?: boolean) => Promise<void>;
/**
 * Insert a CSV file in DuckDB from a File handle.
 */
export declare const insertCSV: (db: AsyncDuckDB, file: File, tableName: string) => Promise<void>;
/**
 * Insert an Arrow file in DuckDB from a File handle.
 */
export declare const insertArrow: (db: AsyncDuckDB, file: File, tableName: string) => Promise<void>;
/**
 * Insert an in-memory Arrow table in DuckDB.
 */
export declare const insertArrowTable: (db: AsyncDuckDB, arrow: Arrow, tableName: string) => Promise<void>;
/**
 * Insert a Parquet file in DuckDB from a File handle.
 */
export declare const insertParquet: (db: AsyncDuckDB, file: File, tableName: string) => Promise<void>;
