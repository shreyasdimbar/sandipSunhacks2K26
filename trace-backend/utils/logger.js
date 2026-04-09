/**
 * TRACE Logger Utility
 *
 * Structured logging with timestamps, log levels, and formatted output.
 */

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

function formatTimestamp() {
  return new Date().toISOString();
}

function shouldLog(level) {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

/**
 * Log an incoming request with endpoint and payload.
 */
export function logRequest(endpoint, payload = {}) {
  if (!shouldLog("INFO")) return;
  console.log("─".repeat(60));
  console.log(`📡  TRACE LOG`);
  console.log(`    Timestamp : ${formatTimestamp()}`);
  console.log(`    Endpoint  : ${endpoint}`);
  console.log(`    Payload   :`, JSON.stringify(payload, null, 2));
  console.log("─".repeat(60));
}

/**
 * Log an informational message.
 */
export function logInfo(label, data = {}) {
  if (!shouldLog("INFO")) return;
  console.log(`ℹ️  [${formatTimestamp()}] ${label}`, JSON.stringify(data));
}

/**
 * Log a warning.
 */
export function logWarn(label, data = {}) {
  if (!shouldLog("WARN")) return;
  console.warn(`⚠️  [${formatTimestamp()}] ${label}`, JSON.stringify(data));
}

/**
 * Log an error with optional Error object.
 */
export function logError(label, error, extra = {}) {
  if (!shouldLog("ERROR")) return;
  console.error(`❌  [${formatTimestamp()}] ${label}`, {
    message: error?.message ?? error,
    stack: error?.stack,
    ...extra,
  });
}

/**
 * Express middleware that logs every incoming request.
 */
export function requestLoggerMiddleware(req, _res, next) {
  logRequest(`${req.method} ${req.originalUrl}`, req.body);
  next();
}
