import * as jwt from "jsonwebtoken";

const JWT_SECRET: string =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your_jwt_secret_key";

export const signJWTToken = (payload: object, options?: jwt.SignOptions) => {
  return jwt.sign(payload, JWT_SECRET, options);
};

// export const verifyJWTToken = (
//   token?: string | null
// ): jwt.JwtPayload | null => {
//   if (!token) {
//     console.warn("JWT verification skipped: token not provided");
//     return null;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     return typeof decoded === "string"
//       ? { data: decoded }
//       : (decoded as jwt.JwtPayload);
//   } catch (err: any) {
//     console.error("JWT verification failed:", err.message);
//     return null;
//   }
// };
