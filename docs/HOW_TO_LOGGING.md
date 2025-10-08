# Logging Best Practices

A comprehensive guide to logging in Node.js/TypeScript applications using Pino.

## Why We Log

Logging serves multiple critical purposes:

1. **Debugging**: Trace execution flow and identify bugs in development and production
2. **Monitoring**: Track application health, performance metrics, and system behavior
3. **Audit trails**: Record important business events and user actions for compliance
4. **Observability**: Provide insights into system behavior for operations teams
5. **Incident response**: Enable quick diagnosis and resolution of production issues

## Log Levels

Use appropriate log levels to categorize events by severity:

### `debug`
**When**: Detailed diagnostic information useful during development
**Examples**:
- Function entry/exit with parameters
- Variable state at specific points
- Detailed algorithm steps

```typescript
log.debug({ userId, params }, "Entering validateUser function");
```

**Production**: Usually disabled (set `LOG_LEVEL=info` or higher)

### `info`
**When**: Normal application behavior and significant events
**Examples**:
- Application startup/shutdown
- Successful completion of operations
- State transitions
- Configuration loaded

```typescript
log.info({ port: 3000 }, "Server started");
log.info({ orderId, userId }, "Order created successfully");
```

### `warn`
**When**: Unexpected situations that don't prevent operation
**Examples**:
- Deprecated API usage
- Fallback to default configuration
- Recoverable errors
- Performance degradation

```typescript
log.warn({ timeoutMs: 5000 }, "Request took longer than expected");
log.warn({ feature: "legacy-api" }, "Using deprecated API");
```

### `error`
**When**: Errors that affect functionality but don't crash the app
**Examples**:
- Failed API calls
- Database errors
- Validation failures
- Caught exceptions

```typescript
log.error({ err, userId }, "Failed to process payment");
log.error({ err: error, requestId }, "Database query failed");
```

**Important**: Always include the error object in the log data.

### `fatal`
**When**: Critical errors that cause application shutdown
**Examples**:
- Unrecoverable database connection failures
- Missing critical configuration
- Uncaught exceptions

```typescript
log.fatal({ err }, "Failed to connect to database");
process.exit(1);
```

## What to Log

### ✅ DO Log

1. **Application lifecycle events**
   ```typescript
   log.info("Application started");
   log.info("Shutting down gracefully");
   ```

2. **Business-significant events**
   ```typescript
   log.info({ orderId, userId, amountUSD }, "Order placed");
   log.info({ userId }, "User registered");
   ```

3. **State transitions**
   ```typescript
   log.info({ orderId, from: "pending", to: "confirmed" }, "Order status changed");
   ```

4. **External API calls** (with timing)
   ```typescript
   log.info({ service: "payment-gateway", durationMs: 250 }, "Payment processed");
   ```

5. **Errors with context**
   ```typescript
   log.error({ err, userId, orderId }, "Payment processing failed");
   ```

6. **Performance metrics**
   ```typescript
   log.info({ endpoint: "/api/users", durationMs: 150, statusCode: 200 }, "Request completed");
   ```

### ❌ DON'T Log

1. **Passwords, tokens, API keys**
   ```typescript
   // ❌ NEVER
   log.info({ password: "secret123" }, "User logged in");

   // ✅ Use redaction (see Security section)
   ```

2. **PII (Personally Identifiable Information) without redaction**
   - Credit card numbers
   - Social security numbers
   - Email addresses (in some jurisdictions)
   - Phone numbers

3. **Large objects or arrays**
   ```typescript
   // ❌ NEVER
   log.info({ users: allUsersArray }, "Retrieved users");

   // ✅ Log count instead
   log.info({ userCount: allUsersArray.length }, "Retrieved users");
   ```

4. **Inside tight loops**
   ```typescript
   // ❌ NEVER
   for (const item of items) {
     log.debug({ item }, "Processing item"); // 1000+ logs!
   }

   // ✅ Log summary
   log.info({ itemCount: items.length }, "Processing items");
   ```

## Structured Logging

Always use structured logging (objects first, message last):

### Good Pattern

```typescript
// ✅ Structured data makes logs searchable and aggregatable
log.info(
  {
    userId: "123",
    requestId: "abc-def",
    durationMs: 150,
    statusCode: 200,
  },
  "Request completed"
);
```

### Bad Pattern

```typescript
// ❌ String interpolation loses structure
log.info(`User 123 completed request abc-def in 150ms with status 200`);
```

### Consistent Field Names

Use consistent field names across your application:

```typescript
// Standard fields
{
  userId: string,        // User identifier
  requestId: string,     // Request/correlation ID
  orderId: string,       // Order identifier
  durationMs: number,    // Duration in milliseconds
  statusCode: number,    // HTTP status code
  err: Error,           // Error object
  amountUSD: number,    // Currency with unit suffix
  timeoutMs: number,    // Timeout with unit suffix
}
```

## Contextual Logging (Child Loggers)

Use child loggers to bind context that applies to multiple log statements:

### Without Child Logger (Repetitive)

```typescript
// ❌ Repetitive - requestId repeated everywhere
log.info({ requestId, userId }, "Request received");
log.info({ requestId, action: "validate" }, "Validating input");
log.info({ requestId, durationMs }, "Request completed");
```

### With Child Logger (Clean)

```typescript
// ✅ Context bound once, reused automatically
const requestLogger = logger.child({ requestId, userId });

requestLogger.info("Request received");
requestLogger.info({ action: "validate" }, "Validating input");
requestLogger.info({ durationMs }, "Request completed");
```

### Express/Fastify Middleware Pattern

```typescript
import { randomUUID } from "crypto";

app.use((req, res, next) => {
  const requestId = randomUUID();
  req.log = logger.child({ requestId });
  req.log.info({ method: req.method, path: req.path }, "Request received");
  next();
});

// In route handlers
app.get("/users/:id", (req, res) => {
  req.log.info({ userId: req.params.id }, "Fetching user");
  // requestId is automatically included
});
```

## Production Patterns

### Development vs Production Configuration

```typescript
import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino(
  isDevelopment
    ? {
        // Pretty print for development
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }
    : {
        // JSON for production (works with log aggregators)
        level: process.env.LOG_LEVEL || "info",
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      }
);
```

### Environment Variables

Control logging behavior via environment variables:

```bash
# Development
NODE_ENV=development LOG_LEVEL=debug npm start

# Production
NODE_ENV=production LOG_LEVEL=info npm start

# Debugging in production (temporary)
LOG_LEVEL=debug npm start
```

### Log Rotation (Production)

For file-based logging, use log rotation:

```typescript
import pino from "pino";
import { createWriteStream } from "pino-roll";

const stream = createWriteStream({
  file: "/var/log/app.log",
  frequency: "daily",
  size: "100M",
});

const logger = pino(stream);
```

Or use external tools like `logrotate` (Linux) or ship to log aggregator (recommended).

## Performance Considerations

### Asynchronous Logging

Pino logs asynchronously by default, preventing blocking of the event loop:

```typescript
// Pino writes to stdout asynchronously
logger.info({ userId: "123" }, "User action");
// Code continues immediately without waiting for I/O
```

### Avoid Expensive Operations in Log Calls

```typescript
// ❌ BAD - serialization happens even if debug is disabled
logger.debug({ data: JSON.stringify(largeObject) }, "Debug data");

// ✅ GOOD - serialization only happens if debug level is enabled
if (logger.isLevelEnabled("debug")) {
  logger.debug({ data: JSON.stringify(largeObject) }, "Debug data");
}

// ✅ BETTER - let Pino serialize (it's optimized)
logger.debug({ data: largeObject }, "Debug data");
```

### Limit Log Volume

```typescript
// Sample high-frequency events
let logCounter = 0;
function processEvent(event) {
  if (logCounter++ % 100 === 0) {
    log.info({ eventsProcessed: logCounter }, "Processing events");
  }
}
```

## Security and Redaction

### Automatic Redaction

Configure Pino to automatically redact sensitive fields:

```typescript
import pino from "pino";

const logger = pino({
  redact: {
    paths: [
      "password",
      "token",
      "apiKey",
      "creditCard",
      "ssn",
      "*.password", // Nested password fields
      "*.token",
      "req.headers.authorization", // Authorization headers
    ],
    remove: true, // Remove fields entirely (vs replacing with [Redacted])
  },
});

// These fields will be automatically removed:
logger.info(
  {
    username: "john",
    password: "secret123", // Will be removed
    email: "john@example.com",
  },
  "User login"
);
// Output: {"level":30,"username":"john","email":"john@example.com","msg":"User login"}
```

### Manual Sanitization

For complex objects, sanitize before logging:

```typescript
function sanitizeUser(user) {
  const { password, apiKey, ...safe } = user;
  return safe;
}

logger.info({ user: sanitizeUser(user) }, "User data");
```

### Error Objects and Stack Traces

Pino serializes errors automatically, including stack traces:

```typescript
try {
  await riskyOperation();
} catch (error) {
  // Pino automatically extracts error.message, error.stack, etc.
  logger.error({ err: error, userId }, "Operation failed");
}
```

**Important**: Use the key `err` for Error objects (Pino's default serializer key).

## Functional Wrapper Pattern

Following FP principles, avoid passing logger instances everywhere:

```typescript
// src/logger.ts
import pino from "pino";

const pinoInstance = pino(/* config */);

// Export functional interface
export const log = {
  debug: (obj: object, msg?: string) => pinoInstance.debug(obj, msg),
  info: (obj: object, msg?: string) => pinoInstance.info(obj, msg),
  warn: (obj: object, msg?: string) => pinoInstance.warn(obj, msg),
  error: (obj: object, msg?: string) => pinoInstance.error(obj, msg),
  fatal: (obj: object, msg?: string) => pinoInstance.fatal(obj, msg),
  child: (bindings: object) => pinoInstance.child(bindings),
};

// Usage in other modules
import { log } from "./logger";

log.info({ userId: "123" }, "User logged in");
```

## Testing with Logging

### Mock Logger for Tests

```typescript
// test/helpers/mockLogger.ts
export const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  fatal: vi.fn(),
  child: vi.fn(() => mockLogger),
};
```

### Suppress Logs in Tests

```typescript
import pino from "pino";

const logger = pino(
  process.env.NODE_ENV === "test"
    ? { level: "silent" } // No output during tests
    : { /* normal config */ }
);
```

### Assert Log Calls

```typescript
test("should log error when validation fails", () => {
  const mockLog = { error: vi.fn() };

  validateUser({ email: "invalid" }, mockLog);

  expect(mockLog.error).toHaveBeenCalledWith(
    expect.objectContaining({ email: "invalid" }),
    "Validation failed"
  );
});
```

## Integration with Log Aggregators

Pino's JSON output integrates seamlessly with log aggregators:

- **Elasticsearch + Kibana**: Ship logs via Filebeat or Logstash
- **Grafana Loki**: Use Promtail to ship logs
- **Datadog**: Use Datadog agent
- **CloudWatch**: Use CloudWatch agent
- **Splunk**: Use Splunk forwarder

Example CloudWatch integration:

```typescript
import pino from "pino";
import { CloudWatchTransport } from "pino-cloudwatch";

const logger = pino({
  transport: {
    target: "pino-cloudwatch",
    options: {
      logGroupName: "/aws/lambda/my-app",
      logStreamName: "production",
    },
  },
});
```

## Quick Reference

### DO

✅ Use structured logging (object first, message last)
✅ Use appropriate log levels
✅ Include context (requestId, userId, etc.)
✅ Log errors with `err` key
✅ Use child loggers for scoped context
✅ Configure redaction for sensitive data
✅ Use environment variables for log level
✅ Ship JSON logs to aggregators in production

### DON'T

❌ Log passwords, tokens, or sensitive PII
❌ Log large objects or arrays
❌ Log inside tight loops
❌ Use string interpolation instead of structured logging
❌ Block the event loop with synchronous logging
❌ Commit console.log statements to production code

## Further Reading

- [Pino Documentation](https://getpino.io/)
- [Pino Best Practices](https://getpino.io/#/docs/best-practices)
- [Structured Logging](https://www.structlog.org/en/stable/why.html)
- [The Twelve-Factor App: Logs](https://12factor.net/logs)
