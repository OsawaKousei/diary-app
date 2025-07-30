import pino from "pino";

// サーバーサイド環境かどうかを判定
const isServer = typeof window === "undefined";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  // サーバーサイドまたは本番環境ではpino-prettyを使わない
  transport:
    !isServer && process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export default logger;
