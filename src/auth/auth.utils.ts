import axios from "axios";

const generateGoogleOauthProviderAuthorizationUrl = (
  redirect_uri: string
): string => {
  const baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const queryParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: redirect_uri,
    response_type: "token",
    scope: "openid profile email",
    prompt: "select_account",
  });
  return `${baseUrl}?${queryParams}`;
};

const getGoogleUserDetails = async (
  accessToken: string
): Promise<{
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}> => {
  try {
    const baseUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

    const { data } = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      id: data.id,
      email: data.email,
      given_name: data.given_name,
      family_name: data.family_name,
      picture: data.picture,
    };
  } catch (error) {
    throw error;
  }
};

export { generateGoogleOauthProviderAuthorizationUrl, getGoogleUserDetails };
