import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import Tabs, { TabItem } from "~/components/ui/tabs/Tabs";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import UrlUtils from "~/utils/app/UrlUtils";
import { useEffect, useState } from "react";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";

type LoaderData = {
  title: string;
};

export let loader: LoaderFunction = async ({ request }) => {  
  const data: LoaderData = {
    title: `${"Settings"} | ${process.env.APP_NAME}`,
  };
  
  return json(data);
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function SettingsRoute() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const appOrAdminData = useAppOrAdminData();

  const [tabs, setTabs] = useState<TabItem[]>([]);

  useEffect(() => {
    const tabs: TabItem[] = [];
    tabs.push({ name: "Profile", routePath: UrlUtils.currentTenantUrl(params, "settings/profile") });    
    
    tabs.push({ name: "Subscriptions", routePath: UrlUtils.currentTenantUrl(params, `settings/subscription`) });
    // tabs.push({ name: "Account", routePath: UrlUtils.currentTenantUrl(params, "settings/account") });
    setTabs(tabs);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appOrAdminData, params]);

  useEffect(() => {
    if (UrlUtils.stripTrailingSlash(location.pathname) === UrlUtils.currentTenantUrl(params, "settings")) {
      navigate(UrlUtils.currentTenantUrl(params, "settings/profile"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2 overflow-auto">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex space-x-3 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Tabs tabs={tabs} className="flex-grow" breakpoint="xl" />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
