export declare const PARQUET_MIME_TYPE = "application/vnd.apache.parquet";
/**
 * Is a given file a Parquet file?
 */
export declare const isParquetFile: (file: File) => Promise<boolean>;
