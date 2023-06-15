export const PARQUET_MIME_TYPE = "application/vnd.apache.parquet";

/**
 * Is a given file a Parquet file?
 */
export const isParquetFile = async (file: File): Promise<boolean> => {
  // If the file starts with the 'PAR1' magic bytes, assume it's Parquet.
  const firstBytes = await file.slice(0, 4).text();
  return firstBytes.startsWith("PAR1");
};
