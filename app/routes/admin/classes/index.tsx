import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { AdminLoaderData, loadAdminData, useAdminData } from "~/utils/data/useAdminData";
import ProfileBanner from "~/components/app/ProfileBanner";

import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getRootQuestionClasses } from "~/utils/db/questionClass.db.server";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import QuestionClassTable from "~/components/questionClass/QuestionClassTable";
// import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";

type LoaderData = AdminLoaderData & {
  title: string;
  items: any;
};

export let loader: LoaderFunction = async ({ request }) => {

  const adminData = await loadAdminData(request);
  // const currentPagination = getPaginationFromCurrentUrl(request);
  const items = await getRootQuestionClasses();


  const data: LoaderData = {
    ...adminData,
    title: `${"Dashboard"} | ${process.env.APP_NAME}`,
    items
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
    <div>
    <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
        <h1 className="flex-1 font-bold flex items-center truncate">Question Categories</h1>
        <div className="flex items-center space-x-2">
          <ButtonSecondary to=".">
                <span>Reload</span>
          </ButtonSecondary>
          <ButtonPrimary to={"/admin/classes/new"}>
                <span>New</span>
          </ButtonPrimary>

        </div>
      </div>      
      </div>
      
      <div className="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuestionClassTable items={data.items}/>
      </div>
    
      </div>      
  );
}
