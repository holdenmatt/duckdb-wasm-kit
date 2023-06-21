const FgRed = "\x1b[31m";
const ResetColors = "\x1b[0m";

/**
 * Format a time interval between start/end timestamps.
 *
 * If no end time is given, use the current time.
 */
const formatElapsedTime = (
  start: number,
  end: number | undefined = undefined
): string => {
  const endTime = end ?? performance.now();
  const elapsed = endTime - start;

  switch (true) {
    case elapsed >= 1000:
      return `${(elapsed / 1000).toFixed(1)}s`;
    case elapsed >= 1:
      return `${elapsed.toFixed(0)}ms`;
    default:
      return `${elapsed.toFixed(3)}ms`;
  }
};

/**
 * Print the elapsed time to console.debug.
 */
export const logElapsedTime = (
  label: string,
  start: number,
  end: number | undefined = undefined
) => {
  const message = `${FgRed}[${formatElapsedTime(start, end)}] ${ResetColors}${label}`;
  console.debug(message);
};
