const UserEnum = ["GENERAL", "ADMIN", "SUPER_ADMIN"];
const UserRole = {
  GENERAL: "GENERAL",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};
const OTPTypeEnum = ["AUTH"];
type OtpType = "AUTH";
type JWTGrantType = "ACCESS" | "REFRESH";

const OauthProviderEnum = ["google"];

export {
  UserEnum,
  UserRole,
  OTPTypeEnum,
  OtpType,
  JWTGrantType,
  OauthProviderEnum,
};
