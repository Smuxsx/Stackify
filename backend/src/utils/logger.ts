type LogData = Record<string, unknown>;

type LogLevel =
  | "DEBUG"
  | "INFO"
  | "WARN"
  | "ERROR";

const escapeString = (value: string): string => {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
};

const formatValue = (value: unknown): string => {
  if (value instanceof Error) {
    return `"${escapeString(value.message)}"`;
  }

  if (typeof value === "string") {
    return `"${escapeString(value)}"`;
  }

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  return String(value);
};

const toLogfmt = (
  level: LogLevel,
  message: string,
  data: LogData = {}
): string => {
  const logData = {
    ...data,
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  return Object.entries(logData)
    .map(
      ([key, value]) =>
        `${key}=${formatValue(value)}`
    )
    .join(" ");
};

const writeLog = (
  level: LogLevel,
  message: string,
  data: LogData = {}
) => {
  const output = toLogfmt(
    level,
    message,
    data
  );

  switch (level) {
    case "DEBUG":
      console.debug(output);
      break;

    case "INFO":
      console.info(output);
      break;

    case "WARN":
      console.warn(output);
      break;

    case "ERROR":
      console.error(output);
      break;
  }
};

const createLogger = (
  context: LogData = {}
) => {
  const debug = (
    message: string,
    data: LogData = {}
  ) => {
    writeLog("DEBUG", message, {
      ...context,
      ...data,
    });
  };

  const info = (
    message: string,
    data: LogData = {}
  ) => {
    writeLog("INFO", message, {
      ...context,
      ...data,
    });
  };

  const warn = (
    message: string,
    data: LogData = {}
  ) => {
    writeLog("WARN", message, {
      ...context,
      ...data,
    });
  };

  const error = (
    message: string,
    data: LogData = {}
  ) => {
    writeLog("ERROR", message, {
      ...context,
      ...data,
    });
  };

  const time = async <T>(
    message: string,
    operation: () => Promise<T>,
    data: LogData = {}
  ): Promise<T> => {
    const startTime = performance.now();

    try {
      const result = await operation();

      const durationMs =
        performance.now() - startTime;

      debug(message, {
        ...data,
        status: "success",
        durationMs: Number(
          durationMs.toFixed(2)
        ),
      });

      return result;
    } catch (err) {
      const durationMs =
        performance.now() - startTime;

      debug(message, {
        ...data,
        status: "failed",
        durationMs: Number(
          durationMs.toFixed(2)
        ),
      });

      throw err;
    }
  };

  return {
    debug,
    info,
    warn,
    error,
    time,

    child(childContext: LogData) {
      return createLogger({
        ...context,
        ...childContext,
      });
    },
  };
};

export const logger = createLogger();