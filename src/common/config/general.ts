const OTP_EXPIRATION_DURATION = 5 * 60 * 1000; // 5 minutes

const ACCESS_TOKEN_VALIDITY = "1d"; // 1 day
const REFRESH_TOKEN_VALIDITY = "30d"; // 30 days

const ALLOWED_GOOGLE_OAUTH_REDIRECT_URLS = [
  "http://127.0.0.1:3000/auth/google/callback",
  "http://localhost:3000/auth/google/callback",
  "https://phishit-ui-dev.tnbswap.com/auth/google/callback",
  "https://phishit-ui.tnbswap.com/auth/google/callback",
];

const ALLOWED_PAYMENT_REDIRECT_URLS = [
  /^http:\/\/127\.0\.0\.1:3000\/bookings\/[0-9a-fA-F]{24}$/,
  /^http:\/\/localhost:3000\/bookings\/[0-9a-fA-F]{24}$/,
  /^https:\/\/phishit-ui-dev\.tnbswap\.com\/bookings\/[0-9a-fA-F]{24}$/,
  /^https:\/\/phishit-ui\.tnbswap\.com\/bookings\/[0-9a-fA-F]{24}$/,
];

const DICEBEAR_URL = "https://api.dicebear.com/7.x/adventurer/svg";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export {
  OTP_EXPIRATION_DURATION,
  ACCESS_TOKEN_VALIDITY,
  REFRESH_TOKEN_VALIDITY,
  ALLOWED_GOOGLE_OAUTH_REDIRECT_URLS,
  ALLOWED_PAYMENT_REDIRECT_URLS,
  DICEBEAR_URL,
  MAX_IMAGE_SIZE,
};
