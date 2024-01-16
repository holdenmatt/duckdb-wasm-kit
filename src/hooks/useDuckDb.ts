import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { useAsync } from "react-async-hook";

import { getDuckDB } from "../init/initializeDuckDb";

/**
 * React hook to access a singleton DuckDb instance within components or other hooks.
 */
export const useDuckDb = (): {
  db: AsyncDuckDB | undefined;
  loading: boolean;
  error: Error | undefined;
} => {
  const {
    result: db,
    loading,
    error,
  } = useAsync(async () => {
    const db = await getDuckDB();
    return db;
  }, []);

  return { db, loading, error };
};
