import { chain } from "@nimpl/middleware-chain";
import { accessPageMiddleware, authMiddleware } from "./middlewares/auth";
import { robotConfig } from "./middlewares/robot";
import { logMiddleware } from "./middlewares/logger";
import { createRateLimitMiddleware, generalLimiter } from "./lib/rate-limiter";

// Rate limiting middleware wrapper
const rateLimitMiddleware = async (req: any) => {
  const rateLimitResponse = await createRateLimitMiddleware(generalLimiter)(req);
  // If rate limit response exists (429), return it
  // Otherwise, return undefined to continue to next middleware
  return rateLimitResponse;
};

export default chain(
  [
    [rateLimitMiddleware, { include: /^\/api(\/.*)?$/ }], // Rate limit API calls
    [authMiddleware, { include: /^\/(dashboard|admin)(\/.*)?$/ }],
    [accessPageMiddleware, { include: /^\/(auth)(\/.*)?$/ }],
    [robotConfig, { include: /^\/(dashboard|admin)(\/.*)?$/ }],
    [
      logMiddleware,
      {
        exclude:
          /^\/(_next|static|favicon\.ico|api\/logger|\.well-known)(\/.*)?$/,
      },
    ], // Request logging
  ],
  {
    logger: {
      log: (msg) => console.log(`product-middleware-chain: ${msg}`),
      warn: (msg) => console.warn(`product-middleware-chain: ${msg}`),
      error: (msg) => console.error(`product-middleware-chain: ${msg}`),
    },
  }
);

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // biar tidak log asset
};
