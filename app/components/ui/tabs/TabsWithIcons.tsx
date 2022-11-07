import { Link, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  tabs: {
    name?: string;
    href?: string;
    current: boolean;
    icon?: ReactNode;
    onClick?: () => void;
  }[];
}
export default function TabsWithIcons({ tabs }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
      <div className={clsx(tabs.length <= 3 && "sm:hidden")}>
        <label htmlFor="tabs" className="sr-only">
          {t("shared.select")}
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full focus:ring-accent-500 focus:border-accent-500 border-gray-300 rounded-md"
          defaultValue={tabs.find((tab) => tab.current)?.name}
          onChange={(e) => {
            const tab = tabs.find((tab) => tab.name === e.target.value);
            if (tab?.href) {
              navigate(tab.href);
            } else if (tab?.onClick) {
              tab.onClick();
            }
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className={clsx(tabs.length <= 3 ? "hidden sm:block" : "hidden")}>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <>
                {tab.href && (
                  <Link
                    key={tab.name}
                    to={tab.href}
                    className={clsx(
                      tab.current ? "border-accent-500 text-accent-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "group inline-flex space-x-2 items-center py-2 px-1 border-b-2 font-medium text-sm"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.icon}
                    <div className="truncate">{tab.name}</div>
                  </Link>
                )}
                {tab.onClick && (
                  <button
                    type="button"
                    onClick={tab.onClick}
                    className={clsx(
                      tab.current ? "border-accent-500 text-accent-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "w-full group inline-flex space-x-2 items-center py-2 px-1 border-b-2 font-medium text-sm"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.icon}
                    <div className="truncate">{tab.name}</div>
                  </button>
                )}
              </>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
