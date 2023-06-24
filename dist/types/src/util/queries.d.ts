/**
 * A few convenient utility queries.
 */
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
export declare enum TableType {
    Table = "Table",
    View = "View"
}
/**
 * Return the table type (table or view) for a given name,
 * or undefined if no such table or view exists.
 */
export declare const tableType: (db: AsyncDuckDB, name: string) => Promise<TableType | undefined>;
/**
 * Drop a table or view with a given name.
 */
export declare const drop: (db: AsyncDuckDB, name: string) => Promise<void>;
/**
 * Rename the table or view with a given name.
 */
export declare const rename: (db: AsyncDuckDB, name: string, newName: string) => Promise<void>;
/**
 * Return all table names that currently exist.
 *
 * Optionally also include views.
 */
export declare const tableNames: (db: AsyncDuckDB, includeViews?: boolean) => Promise<string[]>;
/**
 * Return a mapping from column names to data types, or the empty Map if no such table columns exist.
 */
export declare const columnTypes: (db: AsyncDuckDB, name: string) => Promise<Map<string, string>>;
