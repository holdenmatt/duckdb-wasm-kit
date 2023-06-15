import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import React, { createContext } from "react";

export const DuckDbContext = createContext<AsyncDuckDB | undefined>(undefined);

interface Props {
  db?: AsyncDuckDB;
  children: React.ReactNode;
}

/**
 * React context provider to enable the `useDuckDb` and `useDuckDbQuery` hooks.
 */
const DuckDbProvider = ({ db, children }: Props) => {
  return <DuckDbContext.Provider value={db}>{children}</DuckDbContext.Provider>;
};

export default DuckDbProvider;
