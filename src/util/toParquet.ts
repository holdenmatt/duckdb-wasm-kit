import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { logElapsedTime } from "@holdenmatt/ts-utils";

import {
  isArrowFile,
  isParquetFile,
  exportParquet,
  insertArrow,
  insertCSV,
} from "../files";
import { runQuery } from "./runQuery";
import { getTempFilename } from "./tempfile";

/**
 * Given a Parquet, Arrow, or CSV file, convert it to Parquet.
 *
 * TODO: Remove this (move it elsewhere).
 */
export async function toParquet(db: AsyncDuckDB, file: File) {
  if (await isParquetFile(file)) {
    return file;
  }

  let parquet: File;
  const tempTable = getTempFilename();
  const start = performance.now();

  if (await isArrowFile(file)) {
    await insertArrow(db, file, tempTable);
    logElapsedTime("Inserted Arrow", start);
    parquet = await exportParquet(db, tempTable, file.name);
    logElapsedTime("Exported Parquet", start);
  } else {
    // If file is neither Parquet nor Arrow, assume it's CSV.
    await insertCSV(db, file, tempTable);
    logElapsedTime("Inserted CSV", start);
    parquet = await exportParquet(db, tempTable, file.name);
    logElapsedTime("Exported Parquet", start);
  }

  await runQuery(db, `drop table if exists "${tempTable}"`);
  return parquet;
}
