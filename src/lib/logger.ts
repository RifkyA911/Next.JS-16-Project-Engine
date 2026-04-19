import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { NextRequest } from "next/server";

let logger: winston.Logger;

// Check if we're in Vercel/serverless environment
const isVercel = process.env.VERCEL || process.env.NODE_ENV === "production";

if (!isVercel) {
  // Local development - use file logging
  const logDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const transport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "5m",
    maxFiles: "30d",
    zippedArchive: true,
  });

  logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `[${timestamp}] [${level.toUpperCase()}]: ${message}`
      )
    ),
    transports: [transport],
  });
} else {
  // Vercel/production - use console only
  logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `[${timestamp}] [${level.toUpperCase()}]: ${message}`
      )
    ),
    transports: [new winston.transports.Console()],
  });
}

// Console transport (dengan warna)
// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize({ all: true }),
//         winston.format.timestamp({ format: "HH:mm:ss" }),
//         winston.format.printf(
//           ({ timestamp, level, message }) =>
//             `[${timestamp}] [${level}]: ${message}`
//         )
//       ),
//     })
//   );
// }

export default logger;

export function logRequest(req: NextRequest, status: number, start: number) {
  const duration = Date.now() - start;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  logger.info(`[${ip}] ${req.method} ${req.url} [${status}] ${duration}ms`);
}
