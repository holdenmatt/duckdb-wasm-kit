# duckdb-wasm-kit

Hooks and utilities to make it easier to use
[duckdb-wasm](https://github.com/duckdb/duckdb-wasm) in React apps.

## useDuckDb hook

To initialize and access DuckDB from a React component,
just call the `useDuckDb` hook:

```
import { useDuckDb } from "duckdb-wasm-kit";

const MyComponent = () => {
    const { db, loading, error } = useDuckDb();

    if (db) {
        // Do something with it
    }
    ...
}
```

The first time `useDuckDb` is called, it will take care of downloading the correct
wasm bundle for your browser and initializing an
[AsyncDuckDb](https://shell.duckdb.org/docs/classes/index.AsyncDuckDB.html) instance.

Multiple calls are fine, only one singleton instance will be created.

## Preloading

Loading the DuckDB wasm bundle can take a few seconds.
For a better user experience, you can optionally preload the DuckDB instance
before it's needed, by calling `initializeDuckDB`.

You can also pass a [`DuckDBConfig`](https://shell.duckdb.org/docs/interfaces/index.DuckDBConfig.html) to configure database options.

```
import { initializeDuckDb } from "duckdb-wasm-kit";

const MyApp = () => {
    useEffect(() => {
        const config: DuckDBConfig = {
            query: {
                /**
                 * By default, int values returned by DuckDb are Int32Array(2).
                 * This setting tells DuckDB to cast ints to double instead,
                 * so they become JS numbers.
                 */
                castBigIntToDouble: true,
            },
        }
        initializeDuckDb({ config, debug: true });
    }, []);
    ...
}
```

## Performance logging

If you call `initializeDuckDb` with `debug: true`, elapsed times for all queries will be logged to the browser console, which can be useful during development.

## Accessing outside React

If needed, you can access DuckDb outside of React components like this:

```
import { getDuckDb } from "duckdb-wasm-kit";

const db: AsyncDuckDB = await getDuckDb();
```

## `useDuckDbQuery` hook

As a convenience, we also provide a `useDuckDbQuery` hook to make it easier for components
to react to the typical query lifecycle.

```
import { useDuckDbQuery } from "duckdb-wasm-kit";

const MyComponent = () => {
    const { arrow, loading, error } = useDuckDbQuery(`
        select * from movies
        where actor = 'John Cleese';
    `);

    if (loading) {
        return ...;
    }

    if (error) {
        return ...;
    }

    if (arrow) {
        return ...
    }
}
```

Of course, if you prefer to do things yourself, the `useDuckDB` hook gives you access to
all the [AsyncDuckDb](https://shell.duckdb.org/docs/classes/index.AsyncDuckDB.html) methods.

## Importing files

The `insertFile` function handles the
[annoying details](https://github.com/holdenmatt/duckdb-wasm-kit/blob/main/src/files/insertFile.ts)
of importing a file:

```
const { db } = useDuckDb();
const file: File = ...
const tableName = "myTable";

await insertFile(db, file, tableName);
```

The file can be a CSV, Arrow, or Parquet file. The format will be inferred automatically.

If a tableName isn't provided, `file.name` will be used.

## Exporting files

We similarly provide functions for exporting files:

```
/**
 * Export a table/view to an Arrow file with a given filename.
 */
const exportArrow: (db: AsyncDuckDB, tableName: string, filename?: string) => Promise<File>;

/**
 * Export a table/view to a CSV file.
 */
const exportCsv: (db: AsyncDuckDB, tableName: string, filename?: string, delimiter?: string) => Promise<File>;

/**
 * Export a table/view to Parquet.
 *
 * Uses zstd compression by default, which seems to be both smaller & faster for many files.
 */
const exportParquet: (db: AsyncDuckDB, tableName: string, filename?: string, compression?: "uncompressed" | "snappy" | "gzip" | "zstd") => Promise<File>;
```

## Parquet in the browser!

Parquet is an amazing format for compressing data files (often 90-95% smaller than CSV).

Unfortunately, Javascript has lacked an official Parquet library for years. It's not an
easy format to implement, and it involves multiple compression codecs.

Luckily, duckdb-wasm now makes it trivial to import/convert/export Parquet files in the browser,
with zero dependencies! 🎉

## Try it out!

As a demo of what this library enables, check out [duckbook.ai](https://duckbook.ai).

It's a free SQL notebook I built as a solo project, combining DuckDB with GPT-4 in a
modern Notion-like interface.

Files are converted to Parquet and stored in IndexedDb in your browser, and compute happens
locally in duckdb-wasm. No data is sent to or stored on my servers.

## utils

I include a few common utils and queries in the `utils/` folder, but these may be changed
or removed in the future, so don't depend on them :)

## License

MIT license. Feel free to copy/fork code as you like. No need for attribution, but if you
find this library helpful or build something cool with it, [let me know!](https://twitter.com/holdenmatt/)
