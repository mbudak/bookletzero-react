import { Link, useLocation, useSearchParams, useSubmit } from "@remix-run/react";
import clsx from "clsx";
import { useEffect } from "react";
import { Fragment, useState } from "react";

import { allApplicationCookies, allCookieCategories } from "~/application/cookies/ApplicationCookies";
import { CookieCategory } from "~/application/cookies/CookieCategory";
import { useRootData } from "~/utils/data/useRootData";
import CookieHelper from "~/utils/helpers/CookieHelper";
import Toggle from "../ui/input/Toggle";

interface Props {
  onUpdated?: () => void;
}
export default function CookieConsentSettings({ onUpdated }: Props) {
  
  let { userSession } = useRootData();
  const submit = useSubmit();
  let location = useLocation();
  const [searchParams] = useSearchParams();

  const [openCategories, setOpenCategories] = useState<CookieCategory[]>([]);
  const [selectedCookies, setSelectedCookies] = useState<CookieCategory[]>([]);

  useEffect(() => {
    const initial: CookieCategory[] = [];
    allCookieCategories.forEach((cookie) => {
      if (userSession.cookies.find((f) => f.allowed && f.category === CookieCategory[cookie])) {
        initial.push(cookie);
      }
    });
    setSelectedCookies(initial);
  }, [userSession.cookies]);

  function setCookies(selectedCookies: CookieCategory[]) {
    const form = CookieHelper.getUpdateCookieConsentForm({ selectedCookies, location, searchParams });
    submit(form, { method: "post", action: "/" });
    if (onUpdated) {
      onUpdated();
    }
  }

  function toggle(category: CookieCategory) {
    if (selectedCookies.includes(category)) {
      setSelectedCookies(selectedCookies.filter((f) => f !== category));
    } else {
      setSelectedCookies([...selectedCookies, category]);
    }
  }
  function deny() {
    setCookies([CookieCategory.REQUIRED]);
  }
  function allowSelected() {
    setCookies(selectedCookies);
  }
  function allowAll() {
    setCookies(allCookieCategories);
  }
  function isCategoryOpen(category: CookieCategory) {
    return openCategories.includes(category);
  }
  function toggleOpenCategory(category: CookieCategory) {
    const newOpenCategories = isCategoryOpen(category) ? openCategories.filter((c) => c !== category) : [...openCategories, category];
    setOpenCategories(newOpenCategories);
  }
  return (
    <div className="space-y-3">
      <div className="font-extrabold">Cookies</div>

      <div className="bg-gray-50 text-gray-900 overflow-hidden rounded-md border border-gray-300 max-h-72 overflow-y-auto">
        {allCookieCategories.map((category, idx) => {
          return (
            <Fragment key={category}>
              <div
                className={clsx(
                  "flex items-center justify-between bg-white px-4 hover:bg-gray-50 border-gray-300 py-2",
                  idx < allCookieCategories.length - 1 && "border-b"
                )}
              >
                <button type="button" onClick={() => toggleOpenCategory(category)} className="w-full flex items-center space-x-2 py-3 font-medium">
                  <div>{isCategoryOpen(category) ? "-" : "+"}</div>
                  <div>{t("cookies.categories." + CookieCategory[category] + ".name")}</div>
                </button>
                <Toggle
                  value={selectedCookies.includes(category) || category === CookieCategory.REQUIRED}
                  onChange={() => toggle(category)}
                  disabled={category === CookieCategory.REQUIRED}
                />
              </div>
              {isCategoryOpen(category) && (
                <div className="space-y-2 px-4 pb-2 py-4">
                  <div className="text-sm text-gray-600">{t("cookies.categories." + CookieCategory[category] + ".description")}</div>

                  {allApplicationCookies
                    .filter((f) => f.category === category)
                    .map((item) => {
                      return (
                        <div key={item.name} className="space-y-2 rounded-md border border-dashed border-gray-300 bg-gray-100 p-2 py-2">
                          <div className="font-bold flex justify-between items-baseline">
                            <div>{item.name}</div>
                            {item.href?.startsWith("http") ? (
                              <a target="_blank" rel="noreferrer" href={item.href} className="underline text-theme-500 text-xs">
                                {t("shared.learnMore")}
                              </a>
                            ) : item.href ? (
                              <Link to={item.href} className="underline text-theme-500 text-xs">
                                {t("shared.learnMore")}
                              </Link>
                            ) : null}
                          </div>
                          <div className="font-light text-gray-600 text-sm">{item.description}</div>
                          <div className="w-full border-t border-gray-300" />
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">{t("shared.expiry")}:</span> {item.expiry ?? "?"}
                            </div>
                            {item.type && (
                              <div>
                                <span className="font-medium">{t("shared.type")}:</span> {item.type ?? "?"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={deny}
          className="text-center inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 justify-center truncate"
        >
          {t("shared.deny")}
        </button>
        <button
          type="button"
          onClick={allowSelected}
          className="text-center inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 justify-center truncate"
        >
          {t("shared.allowSelected")}
        </button>
        <button
          type="button"
          onClick={allowAll}
          className="text-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 justify-center truncate"
        >
          {t("shared.allowAll")}
        </button>
      </div>
    </div>
  );
}