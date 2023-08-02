/**
 * Export files from DuckDB.
 */
import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { ARROW_MIME_TYPE, arrowToArrayBuffer } from "./arrow";
import { CSV_MIME_TYPE } from "./csv";
import { PARQUET_MIME_TYPE } from "./parquet";
import { runQuery } from "../util/runQuery";
import { getTempFilename } from "../util/tempfile";

/**
 * Export a table (or view) to an Arrow file with a given filename.
 */
export const exportArrow = async (
  db: AsyncDuckDB,
  tableName: string,
  filename?: string
): Promise<File> => {
  filename = filename || getExportedFilename(tableName, "arrow");

  const arrow = await runQuery(db, `SELECT * FROM '${tableName}'`);
  const buffer = arrowToArrayBuffer(arrow);

  return new File([buffer], filename, { type: ARROW_MIME_TYPE });
};

/**
 * Export a table (or view) to a CSV file with a given filename.
 */
export const exportCsv = async (
  db: AsyncDuckDB,
  tableName: string,
  filename?: string,
  delimiter = ","
): Promise<File> => {
  filename = filename || getExportedFilename(tableName, "csv");

  const tempFile = getTempFilename();
  await runQuery(
    db,
    `COPY '${tableName}' TO '${tempFile}' WITH (HEADER 1, DELIMITER '${delimiter}')`
  );

  const buffer = await db.copyFileToBuffer(tempFile);
  await db.dropFile(tempFile);

  return new File([buffer], filename, { type: CSV_MIME_TYPE });
};

/**
 * Export a table to Parquet.
 *
 * Uses zstd compression by default, which seems to be both smaller & faster for many files.
 */
export const exportParquet = async (
  db: AsyncDuckDB,
  tableName: string,
  filename?: string,
  compression: "uncompressed" | "snappy" | "gzip" | "zstd" = "zstd"
): Promise<File> => {
  filename = filename || getExportedFilename(tableName, "parquet");

  const tempFile = getTempFilename();
  await runQuery(
    db,
    `COPY '${tableName}' TO '${tempFile}' (FORMAT PARQUET, COMPRESSION ${compression})`
  );

  const buffer = await db.copyFileToBuffer(tempFile);
  await db.dropFile(tempFile);

  return new File([buffer], filename, { type: PARQUET_MIME_TYPE });
};

/**
 * Strip the extension off a filename, if it matches a given extension.
 */
const stripFileExtension = (filename: string, extensions: string[]) => {
  const parts = filename.split(".");
  const ext = parts.length > 1 ? (parts.pop() as string) : "";
  const basename = parts.join(".");
  if (extensions.includes(ext)) {
    return basename;
  }
  return filename;
};

/**
 * Get a filename to use when downloading
 */
const getExportedFilename = (tableName: string, extension: string) => {
  // If the table was imported with an extension, strip it.
  const basename = stripFileExtension(tableName, ["arrow", "csv", "parquet"]);

  return basename + "." + extension;
};
