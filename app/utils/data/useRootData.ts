import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { CookieCategory } from "~/application/cookies/CookieCategory";
import { commitAnalyticsSession, destroyAnalyticsSession, generateAnalyticsUserId, getAnalyticsSession } from "../analyticsCookie.server";
import { AppConfiguration, getAppConfiguration } from "../db/appConfiguration.db.server";
import { getUser, UserWithoutPassword } from "../db/users.db.server";
import CookieHelper from "../helpers/CookieHelper";
import { commitSession, generateCSRFToken, getUserInfo, getUserSession, UserSession } from "../session.server";

export type AppRootData = {
  title: string;
  serverUrl: string;
  domainName: string;
  userSession: UserSession;
  authenticated: boolean;
  
  debug: boolean;
  chatWebsiteId?: string;
  appConfiguration: AppConfiguration;
  csrf?: string;
};

export function useRootData(): AppRootData {
  return (useMatches().find((f) => f.pathname === "/" || f.pathname === "")?.data ?? {}) as AppRootData;
}

export async function loadRootData(request: Request) {
  const userInfo = await getUserInfo(request);
  const user: UserWithoutPassword | null = userInfo.userId ? await getUser(userInfo.userId) : null;

  const session = await getUserSession(request);
  const analyticsSession = await getAnalyticsSession(request);

  const csrf = generateCSRFToken();
  session.set("csrf", csrf);

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));
  if (CookieHelper.hasConsent(userInfo, CookieCategory.ANALYTICS)) {
    if (!analyticsSession.get("userAnalyticsId")) {
      analyticsSession.set("userAnalyticsId", generateAnalyticsUserId());
    }
    headers.append("Set-Cookie", await commitAnalyticsSession(analyticsSession));
  } else {
    headers.append("Set-Cookie", await destroyAnalyticsSession(analyticsSession));
  }

  const data: AppRootData = {
    title: `${process.env.APP_NAME}`,
    serverUrl: `${process.env.SERVER_URL}`,
    domainName: `${process.env.DOMAIN_NAME}`,
    userSession: userInfo,
    
    authenticated: userInfo.userId?.length > 0,
    debug: process.env.NODE_ENV === "development",
    chatWebsiteId: process.env.CRISP_CHAT_WEBSITE_ID?.toString(),
    appConfiguration: await getAppConfiguration(),
    csrf,
  };

  return json(data, { headers });
}
