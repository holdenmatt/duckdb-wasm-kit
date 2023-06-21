import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import { useContext } from "react";

import { DuckDbContext } from "../provider/DuckDbProvider";

/**
 * React hook to access the DuckDb instance from an enclosing DuckDbProvider.
 */
export const useDuckDb = (): AsyncDuckDB | undefined => {
  const db = useContext(DuckDbContext);
  return db;
};
