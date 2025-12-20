/**
 * Safe Logger Utility
 * Prevents util.inspect errors during Next.js build by safely handling undefined properties
 */

/**
 * Safely logs an error message without triggering util.inspect errors
 * @param message - The message to log
 * @param error - The error object (optional)
 */
export function safeLogError(message: string, error?: unknown): void {
  if (typeof error === 'object' && error !== null) {
    try {
      // Safely stringify the error to avoid util.inspect issues
      const errorString = error instanceof Error 
        ? error.message 
        : JSON.stringify(error, Object.getOwnPropertyNames(error));
      console.error(message, errorString);
    } catch {
      // If JSON.stringify fails, just log the message
      console.error(message);
    }
  } else if (error) {
    console.error(message, String(error));
  } else {
    console.error(message);
  }
}

/**
 * Safely logs an info message
 * @param message - The message to log
 * @param data - Optional data to log
 */
export function safeLogInfo(message: string, data?: unknown): void {
  if (data && typeof data === 'object') {
    try {
      const dataString = JSON.stringify(data, Object.getOwnPropertyNames(data));
      console.log(message, dataString);
    } catch {
      console.log(message);
    }
  } else if (data) {
    console.log(message, String(data));
  } else {
    console.log(message);
  }
}
