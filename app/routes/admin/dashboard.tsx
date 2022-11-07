import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AdminLoaderData, loadAdminData, useAdminData } from "~/utils/data/useAdminData";
// import { DashboardStats } from "~/components/ui/stats/DashboardStats";
// import { getAdminDashboardStats } from "~/utils/services/adminDashboardService";
// import { getSetupSteps } from "~/utils/services/setupService";
// import SetupSteps from "~/components/admin/SetupSteps";
import ProfileBanner from "~/components/app/ProfileBanner";

// import TenantsTable from "~/components/core/tenants/TenantsTable";
// import { SetupItem } from "~/application/dtos/setup/SetupItem";
// import { Stat } from "~/application/dtos/stats/Stat";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
// import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";

type LoaderData = AdminLoaderData & {
  title: string;
  
};

export let loader: LoaderFunction = async ({ request }) => {

  const adminData = await loadAdminData(request);

  // const stats = await getAdminDashboardStats(30);
  
  // const setupSteps = await getSetupSteps();
  // const currentPagination = getPaginationFromCurrentUrl(request);
  

  const data: LoaderData = {
    ...adminData,
    title: `${"Dashboard"} | ${process.env.APP_NAME}`,
    // stats,
    
    // setupSteps,
    
    
  };
  return json(data);
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function AdminNavigationRoute() {
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();

  return (
    <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
      {/*Page header */}
      <div className="hidden md:block bg-white shadow lg:border-t lg:border-gray-200">
        <ProfileBanner user={data.user} />
      </div>

      <div className="px-4 sm:px-8 max-w-5xl mx-auto py-5 grid gap-5">
        
          <div className="space-y-5 overflow-hidden">
            <div className=" overflow-x-auto">
              setup steps here...
            </div>

            <div className="space-y-3">
              <h3 className=" leading-4 font-medium text-gray-900">Last 30 days</h3>
              Dashboard stats here...
            </div>

            {/* <div className="space-y-2">
            <div className="flex items-center justify-between space-x-2">
              <h3 className=" leading-4 font-medium text-gray-900">Custom entities</h3>
              <ButtonSecondary to="/admin/entities/new">{t("shared.new")}</ButtonSecondary>
            </div>
            <DashboardStats items={data.entitiesStats} />
          </div> */}

            <div className="overflow-x-auto space-y-4">
              <h3 className="leading-4 font-medium text-gray-900">Tenants</h3>
              Tenants here...
            </div>
          </div>
       
      </div>
    </main>
  );
}
