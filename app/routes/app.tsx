import { useEffect } from "react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useNavigate } from "@remix-run/react";
import AppLayout from "~/components/app/AppLayout";
import { loadAppData, useAppData } from "~/utils/data/useAppData";
import { getUser } from "~/utils/db/users.db.server";
// import { getTenantUrl } from "~/utils/services/urlService";
import { getUserInfo } from "~/utils/session.server";
import Page404 from "~/components/pages/Page404";
// import { getTenantUserByIds } from "~/utils/db/tenants.db.server";

export let loader: LoaderFunction = async ({ request, params }) => {
  const data = await loadAppData(request, params);
  // const tenantUrl = await getTenantUrl(params);
  const userInfo = await getUserInfo(request);
  const user = await getUser(userInfo.userId);
  
  /* if (!user?.admin) {
    const tenantUser = await getTenantUserByIds(tenantUrl.tenantId, userInfo.userId);
    if (!tenantUser) {
      throw redirect("/app");
    }
  }
  */
  // await updateUserDefaultTenantId({ defaultTenantId: tenantUrl.tenantId }, userInfo.userId);
  return json(data);
};

export default function AppRoute() {
  const appData = useAppData();
  const navigate = useNavigate();  
  // const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    /*
    if (!appData.user) {
      navigate("/app");
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appData.user]);

  return (
    <div className="bg-white min-h-screen">
      <AppLayout layout="app">
        <Outlet />
      </AppLayout>
    </div>
  );
}

export function CatchBoundary() {
  return (
    <div className="bg-white min-h-screen">
      <AppLayout layout="app">
        <Page404 />
      </AppLayout>
    </div>
  );
}
