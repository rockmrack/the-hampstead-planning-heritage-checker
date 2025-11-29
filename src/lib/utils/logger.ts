/**
 * Enterprise Logger using Winston
 * Provides structured logging with multiple transports
 */

import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp: ts, stack, ...metadata }) => {
  let log = `${ts} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    log += `\n${stack}`;
  }
  
  return log;
});

// Determine log level from environment
const getLogLevel = (): string => {
  return process.env['LOG_LEVEL'] ?? (process.env['NODE_ENV'] === 'production' ? 'info' : 'debug');
};

// Create transports based on environment
const getTransports = (): winston.transport[] => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    }),
  ];

  // Add file transports in production
  if (process.env['NODE_ENV'] === 'production') {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880,
        maxFiles: 5,
      })
    );
  }

  return transports;
};

// Create the logger instance
export const logger = winston.createLogger({
  level: getLogLevel(),
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: getTransports(),
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Utility functions for common logging patterns
export const logInfo = (message: string, meta?: Record<string, unknown>): void => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: Record<string, unknown>): void => {
  logger.error(message, { error: error?.message, stack: error?.stack, ...meta });
};

export const logWarn = (message: string, meta?: Record<string, unknown>): void => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>): void => {
  logger.debug(message, meta);
};

// Request logging
export const logRequest = (
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  meta?: Record<string, unknown>
): void => {
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  logger.log(level, `${method} ${path} ${statusCode} ${duration}ms`, meta);
};

// Search logging
export const logSearch = (
  address: string,
  status: 'RED' | 'AMBER' | 'GREEN',
  duration: number,
  meta?: Record<string, unknown>
): void => {
  logger.info(`Search completed: ${status}`, { address, status, duration, ...meta });
};

// API call logging
export const logApiCall = (
  service: string,
  operation: string,
  success: boolean,
  duration: number,
  meta?: Record<string, unknown>
): void => {
  const level = success ? 'debug' : 'warn';
  logger.log(level, `API call: ${service}/${operation}`, { success, duration, ...meta });
};

export default logger;
