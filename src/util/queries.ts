/**
 * A few convenient utility queries.
 */
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { runQuery } from "./runQuery";
import { AssertionError } from "@holdenmatt/ts-utils";

export enum TableType {
  Table = "Table",
  View = "View",
}

/**
 * Return the table type (table or view) for a given name,
 * or undefined if no such table or view exists.
 */
export const tableType = async (
  db: AsyncDuckDB,
  name: string
): Promise<TableType | undefined> => {
  const arrow = await runQuery(
    db,
    `select table_type from information_schema.tables where table_name = '${name}'`
  );

  if (arrow.numRows === 1) {
    const row = arrow.get(0);
    const type = row?.toArray()[0];
    switch (type) {
      case "BASE TABLE":
        return TableType.Table;
      case "VIEW":
        return TableType.View;
      default:
        throw new AssertionError(`Unexpected table type: ${type}`);
    }
  } else {
    return undefined;
  }
};

/**
 * Drop a table or view with a given name.
 */
export const drop = async (db: AsyncDuckDB, name: string) => {
  const type = await tableType(db, name);
  if (type === TableType.Table) {
    await runQuery(db, `drop table if exists "${name}"`);
  } else if (type === TableType.View) {
    await runQuery(db, `drop view if exists "${name}"`);
  }
};

/**
 * Rename the table or view with a given name.
 */
export const rename = async (
  db: AsyncDuckDB,
  name: string,
  newName: string
) => {
  const type = await tableType(db, name);
  if (type === TableType.Table) {
    await runQuery(db, `alter table "${name}" rename to "${newName}"`);
  } else if (type === TableType.View) {
    await runQuery(db, `alter view "${name}" rename to "${newName}"`);
  } else {
    throw new Error(`Table not found: ${name}`);
  }
};

/**
 * Return all table names that currently exist.
 *
 * Optionally also include views.
 */
export const tableNames = async (
  db: AsyncDuckDB,
  includeViews = false
): Promise<string[]> => {
  const arrow = await runQuery(
    db,
    `select table_name from information_schema.tables
    ${includeViews ? "" : "where table_type = 'BASE TABLE'"}`
  );

  const tables: string[] = arrow.getChild("table_name")?.toArray() || [];
  return tables;
};

/**
 * Return a mapping from column names to data types, or the empty Map if no such table columns exist.
 */
export const columnTypes = async (
  db: AsyncDuckDB,
  name: string
): Promise<Map<string, string>> => {
  const arrow = await runQuery(
    db,
    `select column_name, data_type from information_schema.columns where table_name = '${name}'`
  );

  const columns = new Map<string, string>();
  for (let i = 0; i < arrow.numRows; i++) {
    const row = arrow.get(i);
    if (row) {
      const [column_name, data_type] = row.toArray();
      columns.set(column_name, data_type);
    }
  }

  return columns;
};

/**
 * Compute the cardinalities of all columns in the table with a given name.
 */
export const cardinalities = async (
  db: AsyncDuckDB,
  name: string
): Promise<Record<string, number>> => {
  const types = await columnTypes(db, name);
  const columns = Array.from(types.keys());

  const counts = await runQuery(
    db,
    `select count(distinct columns(*)) from "${name}"`
  );

  const row = counts.get(0);
  if (!row) {
    throw new AssertionError(`Expected a single row of cardinalities: ${name}`);
  }

  const rowValues: number[] = row.toArray();
  if (rowValues.length !== columns.length) {
    throw new AssertionError(`Unexpected length mismatch: ${name}`);
  }

  const cardinalities: Record<string, number> = {};
  for (let i = 0; i < columns.length; i++) {
    cardinalities[columns[i]] = rowValues[i];
  }

  return cardinalities;
};
