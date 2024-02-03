import { getUserUsingPhoneNumber, generateJWT } from "../auth/auth.service";
import { UserRoleType } from "../common/config/enum";

const getAuthenticatedUserJWT = async () => {
  const phoneNumber = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const user = await getUserUsingPhoneNumber(phoneNumber);
  const accessToken = await generateJWT(user, "ACCESS");
  const refreshToken = await generateJWT(user, "REFRESH");

  return { accessToken, refreshToken };
};

const getDeletedUserJWT = async () => {
  const phoneNumber = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const user = await getUserUsingPhoneNumber(phoneNumber);
  const accessToken = await generateJWT(user, "ACCESS");
  user.deleteOne();
  return accessToken;
};

const getUserWithRole = async (role: UserRoleType) => {
  const phoneNumber = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const user = await getUserUsingPhoneNumber(phoneNumber);
  user.roles = [role];
  await user.save();
  return user;
};

export { getAuthenticatedUserJWT, getDeletedUserJWT, getUserWithRole };
