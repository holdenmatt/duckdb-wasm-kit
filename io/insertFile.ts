/**
 * Insert files in DuckDB.
 */
import * as duckdb from "@duckdb/duckdb-wasm";
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { Table as Arrow } from "apache-arrow";

import { arrayBufferToArrow, isArrowFile } from "../files/arrow";
import { isParquetFile } from "../files/parquet";
import { logElapsedTime } from "../util/perf";
import { runQuery } from "../util/runQuery";
import { getTempFilename } from "../util/tempfile";
import { inferTypes } from "./inferTypes";

export class InsertFileError extends Error {
  title: string;
  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    this.name = "InsertFileError";
  }
}

/**
 * Insert a CSV, Arrow, or Parquet file in DuckDB.
 *
 * If successul, return the inserted table name. Otherwise, throw an error.
 *
 * @param debug Print the total elapsed time to the console.
 */
export const insertFile = async (
  db: AsyncDuckDB,
  file: File,
  debug: boolean = false
): Promise<void> => {
  const start = performance.now();
  await _insertFile(db, file);

  if (debug) {
    logElapsedTime(`Imported ${file.name}`, start);
  }
};

/**
 * Private method to do the insert.
 */
const _insertFile = async (db: AsyncDuckDB, file: File): Promise<void> => {
  try {
    // Try Parquet first.
    if (await isParquetFile(file)) {
      await insertParquet(db, file);
      return;
    }

    // Then Arrow.
    if (await isArrowFile(file)) {
      await insertArrow(db, file);
      return;
    }

    // Next, try matching the file extension.
    const filename = file.name.toLowerCase();
    const extension = filename.split(".").at(-1);
    switch (extension) {
      case "arrow":
        await insertArrow(db, file);
        return;
      case "parquet":
        await insertParquet(db, file);
        return;
      case "csv":
        await insertCSV(db, file);
        return;
    }

    // If nothing else matches, try inserting as CSV.
    return await insertCSV(db, file);
  } catch (e) {
    console.error(e);
    if (e instanceof InsertFileError) {
      throw e;
    } else {
      throw new InsertFileError(
        "Invalid file type",
        "Only CSV, Parquet, or Arrow files are supported"
      );
    }
  }
};

/**
 * Insert a CSV file in DuckDB from a File handle.
 */
export const insertCSV = async (
  db: AsyncDuckDB,
  file: File,
  tableName?: string
): Promise<void> => {
  tableName = tableName || file.name;
  try {
    const text = await file.text();

    const tempFile = getTempFilename();
    await db.registerFileText(tempFile, text);

    const conn = await db.connect();
    await conn.insertCSVFromPath(tempFile, {
      name: tableName,
      schema: "main",
      header: true,
      detect: true,
    });
    await conn.close();
    db.dropFile(tempFile);

    // Infer additional column types after CSV import.
    await inferTypes(db, tableName);
  } catch (e) {
    console.error(e);
    // The file looks like a CSV, but parsing failed.
    if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
      throw new InsertFileError(
        "CSV import failed",
        "Sorry, we couldn't import that CSV. Please try again."
      );
    }

    // Probably an invalid file type.
    throw e;
  }
};

/**
 * Insert an Arrow file in DuckDB from a File handle.
 */
export const insertArrow = async (
  db: AsyncDuckDB,
  file: File,
  tableName?: string
): Promise<void> => {
  tableName = tableName || file.name;
  try {
    const buffer = await file.arrayBuffer();
    const arrow = arrayBufferToArrow(buffer);
    await insertArrowTable(db, arrow, tableName);
  } catch (e) {
    console.error(e);
    throw new InsertFileError(
      "Arrow import failed",
      "Sorry, we couldn't import that file"
    );
  }
};

/**
 * Insert an in-memory Arrow table in DuckDB.
 */
export const insertArrowTable = async (
  db: AsyncDuckDB,
  arrow: Arrow,
  tableName: string
): Promise<void> => {
  const conn = await db.connect();
  await conn.insertArrowTable(arrow, { name: tableName });
  await conn.close();
};

/**
 * Insert a Parquet file in DuckDB from a File handle.
 */
export const insertParquet = async (
  db: AsyncDuckDB,
  file: File,
  tableName?: string
): Promise<void> => {
  tableName = tableName || file.name;
  try {
    const tempFile = getTempFilename() + ".parquet";
    await db.registerFileHandle(
      tempFile,
      file,
      duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
      true
    );
    await runQuery(db, `CREATE TABLE '${tableName}' AS SELECT * FROM '${tempFile}'`);
    await db.dropFile(tempFile);
  } catch (e) {
    console.error(e);
    throw new InsertFileError(
      "Parquet import failed",
      "Sorry, we couldn't import that file"
    );
  }
};
