const OTP_EXPIRATION_DURATION = 5 * 60 * 1000; // 5 minutes

const ACCESS_TOKEN_VALIDITY = "1d"; // 1 day
const REFRESH_TOKEN_VALIDITY = "30d"; // 30 days

const ALLOWED_REDIRECT_URLS = [
  "http://127.0.0.1:3000/auth/google/callback",
  "https://phishit-ui-dev.tnbswap.com/auth/google/callback",
  "https://phishit-ui.tnbswap.com/auth/google/callback",
];

export {
  OTP_EXPIRATION_DURATION,
  ACCESS_TOKEN_VALIDITY,
  REFRESH_TOKEN_VALIDITY,
  ALLOWED_REDIRECT_URLS,
};
