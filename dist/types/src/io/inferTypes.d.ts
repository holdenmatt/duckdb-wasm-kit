import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * Infer certain column types that DuckDB tends to get wrong when importing (untyped) CSVs.
 */
export declare const inferTypes: (db: AsyncDuckDB, tableName: string) => Promise<void>;
