import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { useDuckDb } from "./src/hooks/useDuckDb";
import { useDuckDbQuery } from "./src/hooks/useDuckDbQuery";
import initializeDuckDb, { getDuckDB } from "./src/init/initializeDuckDb";
import { runQuery } from "./src/util/runQuery";
import { getTempFilename } from "./src/util/tempfile";
import { drop, cardinalities } from "./src/util/queries";

export * from "./src/files";

export {
  AsyncDuckDB,
  getDuckDB,
  initializeDuckDb,
  runQuery,
  useDuckDb,
  useDuckDbQuery,
};

// Don't depend on these :)
export { getTempFilename, drop, cardinalities };
