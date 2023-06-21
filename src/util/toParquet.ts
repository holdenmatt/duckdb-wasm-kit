import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { isArrowFile } from "../files/arrow";
import { isParquetFile } from "../files/parquet";
import { exportParquet } from "../io";
import { insertArrow, insertCSV } from "../io/insertFile";
import { logElapsedTime } from "./perf";
import { runQuery } from "./runQuery";
import { getTempFilename } from "./tempfile";

/**
 * Given a Parquet, Arrow, or CSV file, convert it to Parquet.
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
