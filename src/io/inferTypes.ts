import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { columnTypes } from "../util/queries";
import { runQuery } from "../util/runQuery";

/**
 * Infer certain column types that DuckDB tends to get wrong when importing (untyped) CSVs.
 *
 * TODO: This probably doesn't belong here. Either expand it or remove it.
 */
export const inferTypes = async (db: AsyncDuckDB, tableName: string) => {
  const types = await columnTypes(db, tableName);
  const columns = Array.from(types.keys());

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    /**
     * If an int column includes 'year' in the name, change it to string.
     */
    if (column.toLowerCase().includes("year")) {
      await runQuery(
        db,
        `ALTER TABLE "${tableName}" ALTER COLUMN "${column}" SET DATA TYPE VARCHAR`
      );
    }
  }
};
