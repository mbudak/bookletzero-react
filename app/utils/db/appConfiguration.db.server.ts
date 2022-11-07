export type AppConfiguration = {
    appName: string;
    auth: {
      requireEmailVerification: boolean;
      requireOrganization: boolean;
      // requireName: boolean;
      recaptcha: {
        enabled: boolean;
        siteKey: string;
      };
    };
    analytics: {
      enabled: boolean;
      simpleAnalytics: boolean;
      plausibleAnalytics: boolean;
      googleAnalyticsTrackingId?: string;
    };
  };
  export async function getAppConfiguration(): Promise<AppConfiguration> {
    return {
      appName: process.env.APP_NAME?.toString() ?? "",
      auth: {
        requireEmailVerification: process.env.AUTH_REQUIRE_VERIFICATION === "true",
        requireOrganization: process.env.AUTH_REQUIRE_ORGANIZATION === "true",
        // requireName: process.env.AUTH_REQUIRE_NAME === "true",
        recaptcha: {
          enabled: process.env.AUTH_RECAPTCHA_ENABLED === "true",
          siteKey: process.env.AUTH_RECAPTCHA_SITE_KEY ?? "",
        },
      },
      analytics: {
        enabled: process.env.ANALYTICS_ENABLED === "true",
        googleAnalyticsTrackingId: process.env.ANALYTICS_GA_TRACKING_ID,
        simpleAnalytics: process.env.ANALYTICS_SIMPLEANALYTICS === "true",
        plausibleAnalytics: process.env.ANALYTICS_PLAUSIBLEANALYTICS === "true",
      },
    };
  }
  
  export async function getAppName() {
    return (await getAppConfiguration()).appName;
  }