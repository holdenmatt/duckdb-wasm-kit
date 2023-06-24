import { Table as Arrow } from "apache-arrow";
export type { Table as Arrow } from "apache-arrow";
export declare const ARROW_MIME_TYPE = "application/vnd.apache.arrow.file";
/**
 * Is a given object an Arrow table?
 */
export declare const isArrow: (obj: unknown) => obj is Arrow<any>;
/**
 * Is a given File a valid Arrow IPC file?
 */
export declare const isArrowFile: (file: File) => Promise<boolean>;
/**
 * Load an Arrow table from an IPC file, as an ArrayBuffer.
 */
export declare const arrayBufferToArrow: (arrayBuffer: ArrayBuffer) => Arrow;
/**
 * Convert an Arrow to an IPC file, as an ArrayBuffer.
 */
export declare const arrowToArrayBuffer: (arrow: Arrow) => ArrayBuffer;
/**
 * Convert an Apache Arrow table to an array of JSON row objects.
 */
export declare function arrowToJSON(arrow: Arrow): Record<string, any>[];
