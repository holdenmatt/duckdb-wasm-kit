import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
/**
 * Infer certain column types that DuckDB tends to get wrong when importing (untyped) CSVs.
 *
 * TODO: This probably doesn't belong here. Either expand it or remove it.
 */
export declare const inferTypes: (db: AsyncDuckDB, tableName: string) => Promise<void>;
