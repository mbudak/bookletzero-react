import { ActionFunction, LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useActionData, useCatch, useLoaderData, useLocation, useMatches } from "@remix-run/react";

import styles from "./styles/tailwind.css";

import { createUserSession, getUserInfo } from "./utils/session.server";
import { loadRootData, useRootData } from "./utils/data/useRootData";
import FloatingLoader from "./components/ui/loaders/FloatingLoader";
import Page404 from "./components/pages/Page404";
import CookieConsentBanner from "./components/cookies/CookieConsentBanner";
import { allCookieCategories } from "./application/cookies/ApplicationCookies";
import { CookieCategory } from "./application/cookies/CookieCategory";
import { useEffect, useState } from "react";
import { addPageView } from "./utils/services/analyticsService";
import CookieHelper from "./utils/helpers/CookieHelper";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader: LoaderFunction = async ({ request }) => {
  return loadRootData(request);
};

export const meta: MetaFunction = ({ data }) => {
  const description = `BookletZERO is a printable test booklet generator`;
  return {
    charset: "utf-8",
    title: data?.title,
    description,
    keywords: "exam, question, booklet, english, math, exam booklet, online exam, custom exam",
    "og:title": "BookletZERO | Printable exam booklet generator",
    "og:type": "website",
    "og:url": "https://bookletzero.com",
    "og:image": "https://bookletzero.com/img/cover.png",
    "og:card": "summary_large_image",
    "og:creator": "@BookletZERO",
    "og:site": "https://bookletzero.com",
    "og:description": description,
    "twitter:image": "https://bookletzero.com/img/thumbnail.png",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@BookletZERO",
    "twitter:site": "@bookletzero",
    "twitter:title": "BookletZERO",
    "twitter:description": description,
  };
};

function Document({ children }: { children: React.ReactNode; title?: string }) {
  const location = useLocation();
  const rootData = useRootData();
  const [lastLocation, setLastLocation] = useState("");
  const matches = useMatches();
  const actionData = useActionData();

  useEffect(() => {
    if (lastLocation == location.pathname) {
      return;
    }
    const routeMatch = matches.find((m) => m.pathname == location.pathname);
    if (CookieHelper.hasConsent(rootData.userSession, CookieCategory.ANALYTICS)) {
      setLastLocation(location.pathname);
    }

    async function addView() {
      await addPageView({
        url: location.pathname,
        route: routeMatch?.id,
        rootData,
      });
    }
    addView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLocation, location, rootData, actionData]);

  return (
    <html lang={rootData.userSession?.lng ?? "en"} >
      <head>
        <Meta />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        

        <Links />
      </head>

      <body className="min-h-screen text-gray-800 dark:text-white bg-white dark:bg-slate-900 max-w-full max-h-full">
        {children}

        {rootData.appConfiguration.analytics.enabled && (
          <>
            {!rootData.debug && rootData.appConfiguration.analytics.simpleAnalytics && (
              <>
                <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
                <noscript>
                  <img
                    src="https://queue.simpleanalyticscdn.com/noscript.gif"
                    alt="privacy-friendly-simpleanalytics"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </noscript>
              </>
            )}

            {rootData.appConfiguration.analytics.plausibleAnalytics && (
              <>
                <script defer data-domain={rootData.domainName} src="https://plausible.io/js/script.local.js"></script>
              </>
            )}

            
          </>
        )}

        <LiveReload />
        <FloatingLoader />
        <ScrollRestoration />
        <Scripts />
        
      </body>
    </html>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action");
  const redirect = form.get("redirect")?.toString();
  
  if (action === "setLocale") {
    const lng = form.get("lng")?.toString() ?? "";
    return createUserSession(
      {
        userId: userInfo?.userId,        
        lng,
        cookies: userInfo.cookies,
      },
      redirect
    );
  }
};
export default function App() {
  let { lng } = useLoaderData<{ lng: string }>();
  
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>
          {caught.status === 404 ? (
            <Page404 />
          ) : (
            <div className="mx-auto p-12 text-center">
              {caught.status} {caught.statusText}
            </div>
          )}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const data = useRootData();
  return (
    <Document title="Unexpected error">
      <div className="mx-auto p-12 text-center">
        <h1>
          Server error,{" "}
          <button type="button" onClick={() => window.location.reload()} className="underline">
            please try again
          </button>
          {data.debug && (
            <div className="flex flex-col space-y-1 text-left">
              <div>
                <span className="font-bold">Message:</span> {error.message}
              </div>
              <div>
                <span className="font-bold">Stack:</span> {error.stack}
              </div>
            </div>
          )}
        </h1>
      </div>
    </Document>
  );
}
