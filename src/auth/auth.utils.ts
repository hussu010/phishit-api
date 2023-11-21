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

export { generateGoogleOauthProviderAuthorizationUrl };
