const configuredLoginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL?.trim();

export const portalUrl =
  configuredLoginUrl && !configuredLoginUrl.includes("example.com")
    ? configuredLoginUrl
    : "/signin";
