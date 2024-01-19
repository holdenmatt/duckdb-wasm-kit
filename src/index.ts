import { AsyncDuckDB } from "@duckdb/duckdb-wasm";

import { useDuckDb } from "./hooks/useDuckDb";
import { useDuckDbQuery } from "./hooks/useDuckDbQuery";
import initializeDuckDb, { getDuckDB } from "./init/initializeDuckDb";
import { cardinalities, drop } from "./util/queries";
import { runQuery } from "./util/runQuery";
import { getTempFilename } from "./util/tempfile";

export * from "./files";

export { AsyncDuckDB, getDuckDB, initializeDuckDb, runQuery, useDuckDb, useDuckDbQuery };

// Don't depend on these :)
export { cardinalities, drop, getTempFilename };
