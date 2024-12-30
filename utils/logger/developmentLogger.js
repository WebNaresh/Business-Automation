const { transports, createLogger, format } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, json, colorize } =
  format;
const color = {
  info: "\x1b[36m",
  error: "\x1b[31m",
  warn: "\x1b[33m",
  verbose: "\x1b[32m",
  debug: "\x1b[34m",
  silly: "\x1b[35m",
};

const customFormat = printf(({ timestamp, level, message, label }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

developmentLogger = () => {
  return createLogger({
    level: "info",
    format: combine(
      colorize(), // Add colorization to the console output
      timestamp({
        format: "DD-MM-YYYY HH:mm:ss",
      }),
      label({ label: "winston log" }),
      customFormat
    ),
    defaultMeta: { service: "user-service" },
    transports: [
      // Log to the console for development
      new transports.Console({
        format: combine(
          timestamp({
            format: "DD-MM-YYYY HH:mm:ss",
          }),
          label({ label: "winston log" }),
          customFormat
        ),
      }),
      // Log to a file
      new transports.File({
        filename: "testLogs.txt",
        level: "info",
        format: combine(
          timestamp({
            format: "DD-MM-YYYY HH:mm:ss",
          }),
          label({ label: "winston log" }),
          json()
        ),
      }),
    ],
  });
};

module.exports = developmentLogger;
