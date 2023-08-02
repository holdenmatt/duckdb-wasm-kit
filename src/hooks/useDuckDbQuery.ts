import { Table as Arrow } from "apache-arrow";
import { useAsync } from "react-async-hook";

import { runQuery } from "../util/runQuery";
import { useDuckDb } from "./useDuckDb";

/**
 * Execute a SQL query and return the result as Arrow.
 *
 * Wait for DuckDB to initialize if necessary.
 *
 * If sql is undefined, returns undefined.
 */
export const useDuckDbQuery = (
  sql: string | undefined
): {
  arrow: Arrow | undefined;
  loading: boolean;
  error: Error | undefined;
} => {
  const { db } = useDuckDb();

  const {
    result: arrow,
    loading,
    error,
  } = useAsync(async () => {
    if (!db || !sql) {
      return undefined;
    }

    const arrow = await runQuery(db, sql);
    return arrow;
  }, [db, sql]);

  return { arrow, loading, error };
};
