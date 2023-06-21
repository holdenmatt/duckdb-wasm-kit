/**
 * Create a temporary unique filename, to avoid collisions.
 */
export const getTempFilename = () => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  return `file-${timestamp}-${randomString}`;
};
