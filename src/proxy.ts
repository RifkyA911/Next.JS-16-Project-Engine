import { chain } from "@nimpl/middleware-chain";
import { accessPageMiddleware, authMiddleware } from "./middlewares/auth";

export default chain(
  [
    [authMiddleware, { include: /^\/(dashboard|admin)(\/.*)?$/ }],
    [accessPageMiddleware, { include: /^\/(auth)(\/.*)?$/ }],
    // [
    //   logMiddleware,
    //   {
    //     exclude:
    //       /^\/(_next|static|favicon\.ico|api\/logger|\.well-known)(\/.*)?$/,
    //   },
    // ], // history logger
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
