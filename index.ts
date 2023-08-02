import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { useDuckDb } from "./src/hooks/useDuckDb";
import { useDuckDbQuery } from "./src/hooks/useDuckDbQuery";
import initializeDuckDb, { getDuckDB } from "./src/init/initializeDuckDb";
import { runQuery } from "./src/util/runQuery";

export * from "./src/files";
export * from "./src/io";

export {
  AsyncDuckDB,
  getDuckDB,
  initializeDuckDb,
  runQuery,
  useDuckDb,
  useDuckDbQuery,
};
