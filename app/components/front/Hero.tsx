import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import Header from "./Header";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Header />
      <div className="relative overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-0" aria-hidden="true">
          <svg
            className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern id="f210dbf6-a58d-4871-961e-36d5016a0f49" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-gray-200 dark:text-gray-800" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg
            className="  absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2 text-gray-200 dark:text-gray-800"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
          >
            <defs>
              <pattern id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
          </svg>
        </div>

        <div className="relative">
          <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-16 sm:px-6 lg:mt-16">
            <div>
              <div className="sm:text-center md:max-w-6xl md:mx-auto lg:col-span-6 space-y-3">
                <span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                  {t("front.hero.subheadline1")}
                </span>
                <h1 className="font-extrabold text-5xl sm:text-5xl md:text-5xl lg:text-7xl flex flex-col">
                  <span>{t("front.hero.headline1")}</span>
                </h1>
                <div className="relative z-10 pb-10 text-gray-500 text-lg md:text-2xl sm:text-center leading-normal md:leading-9 space-y-3">
                  {/* <p className="sm:text-2xl mx-auto max-w-4xl font-medium text-gray-700 dark:text-gray-400">{t("front.hero.headline2")}</p> */}
                  <p className="sm:text-xl mx-auto max-w-4xl">
                    {t("front.hero.headline2")} - {t("front.hero.headline3")}
                  </p>
                </div>

                <div className="mt-2 mx-auto lg:mx-0 sm:flex justify-center md:mt-2">
                  <div className="rounded-md shadow">
                    <a
                      href="/learn"
                      target="_self"
                      rel="noreferrer"
                      className="w-full flex items-center space-x-2 justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-theme-500 text-theme-50 hover:bg-theme-600 md:py-4 md:text-lg md:px-7"
                    >
                      <div>Learns</div>
                    </a>
                  </div>
                  

                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      to="/docs"
                      className="w-full flex items-center justify-center px-5 py-3 border border-gray-200 dark:border-gray-800 text-base font-medium rounded-md text-theme-600 dark:text-theme-400 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:text-theme-500 md:py-4 md:text-lg md:px-7"
                    >
                      Docs
                    </Link>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  
                    Find your interested topic and generate exam booklets, easy. All question databases frequently updated.
                  
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}