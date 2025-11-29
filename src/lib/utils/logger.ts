/**
 * Structured Logger with OpenTelemetry support
 * Enterprise-grade logging with correlation IDs and metrics
 */

import winston from 'winston';

// Environment configuration
const isProduction = process.env['NODE_ENV'] === 'production';
const isDevelopment = process.env['NODE_ENV'] === 'development';
const logLevel = process.env['LOG_LEVEL'] ?? (isProduction ? 'info' : 'debug');

// Custom format for structured JSON logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'ISO' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Pretty format for development
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

// Create the logger instance
export const logger = winston.createLogger({
  level: logLevel,
  defaultMeta: {
    service: 'hampstead-heritage-checker',
    version: process.env['npm_package_version'] ?? '1.0.0',
    environment: process.env['NODE_ENV'] ?? 'development',
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: isDevelopment ? devFormat : structuredFormat,
    }),
  ],
  exitOnError: false,
});

// Add file transport in production
if (isProduction) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: structuredFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: structuredFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    })
  );
}

// Request context for correlation
interface RequestContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  spanId?: string;
}

// Request context storage
let requestContext: RequestContext = {};

/**
 * Set the request context for logging
 */
export function setRequestContext(context: RequestContext): void {
  requestContext = { ...requestContext, ...context };
}

/**
 * Get the current request context
 */
export function getRequestContext(): RequestContext {
  return { ...requestContext };
}

/**
 * Clear the request context
 */
export function clearRequestContext(): void {
  requestContext = {};
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(meta: Record<string, unknown>) {
  return logger.child(meta);
}

/**
 * Log an info message with context
 */
export function logInfo(message: string, meta?: Record<string, unknown>): void {
  logger.info(message, { ...requestContext, ...meta });
}

/**
 * Log an error with context
 */
export function logError(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
  const errorMeta: Record<string, unknown> = { ...requestContext, ...meta };
  
  if (error instanceof Error) {
    errorMeta.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  } else if (error) {
    errorMeta.error = String(error);
  }

  logger.error(message, errorMeta);
}

/**
 * Log a warning with context
 */
export function logWarn(message: string, meta?: Record<string, unknown>): void {
  logger.warn(message, { ...requestContext, ...meta });
}

/**
 * Log a debug message with context
 */
export function logDebug(message: string, meta?: Record<string, unknown>): void {
  logger.debug(message, { ...requestContext, ...meta });
}

/**
 * Log an HTTP request
 */
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  meta?: Record<string, unknown>
): void {
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  
  logger.log(level, `${method} ${path} ${statusCode}`, {
    ...requestContext,
    http: {
      method,
      path,
      statusCode,
      durationMs,
    },
    ...meta,
  });
}

/**
 * Log an API call to external service
 */
export function logApiCall(
  service: string,
  endpoint: string,
  success: boolean,
  durationMs: number,
  meta?: Record<string, unknown>
): void {
  const level = success ? 'info' : 'error';
  
  logger.log(level, `External API call: ${service}/${endpoint}`, {
    ...requestContext,
    external: {
      service,
      endpoint,
      success,
      durationMs,
    },
    ...meta,
  });
}

/**
 * Log a search operation
 */
export function logSearch(
  address: string,
  status: string,
  durationMs: number,
  meta?: Record<string, unknown>
): void {
  logger.info('Property search completed', {
    ...requestContext,
    search: {
      address,
      status,
      durationMs,
    },
    ...meta,
  });
}

/**
 * Log a database query
 */
export function logQuery(
  table: string,
  operation: string,
  durationMs: number,
  success: boolean,
  meta?: Record<string, unknown>
): void {
  const level = success ? 'debug' : 'error';
  
  logger.log(level, `Database ${operation} on ${table}`, {
    ...requestContext,
    db: {
      table,
      operation,
      durationMs,
      success,
    },
    ...meta,
  });
}

/**
 * Performance timing helper
 */
export function startTimer(): () => number {
  const start = process.hrtime.bigint();
  return () => {
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  };
}

/**
 * Metrics collection (can be extended with Prometheus/DataDog)
 */
interface Metrics {
  searchCount: number;
  errorCount: number;
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime: number;
  responseTimes: number[];
}

const metrics: Metrics = {
  searchCount: 0,
  errorCount: 0,
  cacheHits: 0,
  cacheMisses: 0,
  avgResponseTime: 0,
  responseTimes: [],
};

/**
 * Increment a metric counter
 */
export function incrementMetric(metric: keyof Pick<Metrics, 'searchCount' | 'errorCount' | 'cacheHits' | 'cacheMisses'>): void {
  metrics[metric]++;
}

/**
 * Record response time
 */
export function recordResponseTime(ms: number): void {
  metrics.responseTimes.push(ms);
  
  // Keep only last 1000 times for memory efficiency
  if (metrics.responseTimes.length > 1000) {
    metrics.responseTimes.shift();
  }
  
  // Recalculate average
  metrics.avgResponseTime = 
    metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length;
}

/**
 * Get current metrics
 */
export function getMetrics(): Omit<Metrics, 'responseTimes'> {
  return {
    searchCount: metrics.searchCount,
    errorCount: metrics.errorCount,
    cacheHits: metrics.cacheHits,
    cacheMisses: metrics.cacheMisses,
    avgResponseTime: Math.round(metrics.avgResponseTime * 100) / 100,
  };
}

export default logger;
