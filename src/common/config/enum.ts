const UserEnum = ["GENERAL", "ADMIN", "SUPER_ADMIN"];
const UserRole = {
  GENERAL: "GENERAL",
  GUIDE: "GUIDE",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
};
type UserRoleType = "GENERAL" | "GUIDE" | "ADMIN" | "SUPER_ADMIN";
const OTPTypeEnum = ["AUTH"];
const StatusEnum = ["PENDING", "APPROVED", "REJECTED"];
type StatusType = "PENDING" | "APPROVED" | "REJECTED";
const GuideTypeEnum = ["INDIVIDUAL", "ORGANIZATION"];
const GuideRequestDocumentTypeEnum = [
  "NID",
  "PASSPORT",
  "COMPANY_REGISTRATION_CERTIFICATE",
  "OTHER",
];
type GuideType = "INDIVIDUAL" | "ORGANIZATION";
type OtpType = "AUTH";
type JWTGrantType = "ACCESS" | "REFRESH";

const GenderEnum = ["MALE", "FEMALE", "OTHER"];

const OauthProviderEnum = ["google"];

export {
  UserEnum,
  UserRole,
  UserRoleType,
  OTPTypeEnum,
  OtpType,
  JWTGrantType,
  OauthProviderEnum,
  GenderEnum,
  StatusEnum,
  StatusType,
  GuideTypeEnum,
  GuideType,
  GuideRequestDocumentTypeEnum,
};
