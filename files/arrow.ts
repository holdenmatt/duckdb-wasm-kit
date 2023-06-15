import { Table as Arrow, tableFromIPC, tableToIPC } from "apache-arrow";

export type { Table as Arrow } from "apache-arrow";

export const ARROW_MIME_TYPE = "application/vnd.apache.arrow.file";

/**
 * Is a given object an Arrow table?
 */
export const isArrow = (obj: unknown): obj is Arrow => obj instanceof Arrow;

/**
 * Is a given File a valid Arrow IPC file?
 */
export const isArrowFile = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.arrayBuffer();
    arrayBufferToArrow(buffer);
    return true;
  } catch {}

  return false;
};

/**
 * Load an Arrow table from an IPC file, as an ArrayBuffer.
 */
export const arrayBufferToArrow = (arrayBuffer: ArrayBuffer): Arrow => {
  const arrow = tableFromIPC(new Uint8Array(arrayBuffer));
  return arrow;
};

/**
 * Convert an Arrow to an IPC file, as an ArrayBuffer.
 */
export const arrowToArrayBuffer = (arrow: Arrow): ArrayBuffer => {
  const array = tableToIPC(arrow, "file");
  return array.buffer;
};

/**
 * Convert an Apache Arrow table to an array of JSON row objects.
 */
export function arrowToJSON(arrow: Arrow): Record<string, any>[] {
  const rows: Record<string, any>[] = [];
  for (const row of arrow) {
    rows.push(row.toJSON());
  }
  return rows;
}
