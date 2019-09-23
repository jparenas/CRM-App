export const cookiesSecret =
  process.env.NODE_COOKIE_SECRET ||
  process.env.NODE_JWT_SECRET ||
  "Cookie Secret Phrase";

export const jwtCookieName = "jwt";

export const jwtSecret =
  process.env.NODE_JWT_SECRET ||
  process.env.NODE_COOKIE_SECRET ||
  "JWT Secret Phrase";
