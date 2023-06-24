import { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import React from "react";
export declare const DuckDbContext: React.Context<AsyncDuckDB | undefined>;
interface Props {
    db?: AsyncDuckDB;
    children: React.ReactNode;
}
/**
 * React context provider to enable the `useDuckDb` and `useDuckDbQuery` hooks.
 */
declare const DuckDbProvider: ({ db, children }: Props) => React.JSX.Element;
export default DuckDbProvider;
