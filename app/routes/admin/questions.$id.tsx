import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { AdminLoaderData, loadAdminData, useAdminData } from "~/utils/data/useAdminData";
import ProfileBanner from "~/components/app/ProfileBanner";

import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getQuestionClassesByRoot, getRootQuestionClasses } from "~/utils/db/questionClass.db.server";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import QuestionClassTable from "~/components/questionClass/QuestionClassTable";
import { getQuestionsByClass } from "~/utils/db/questions.db.server";
import QuestionsTable from "~/components/question/QuestionsTable";
// import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";

type LoaderData = AdminLoaderData & {
  title: string;
  id: any;
  items: any;
};

export let loader: LoaderFunction = async ({ request, params }) => {

  const adminData = await loadAdminData(request);
  // const currentPagination = getPaginationFromCurrentUrl(request);
  
  const items = await getQuestionsByClass(params.id);

  const data: LoaderData = {
    ...adminData,
    title: `${"Questions"} | ${process.env.APP_NAME}`,
    id: params.id,
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
        <h1 className="flex-1 font-bold flex items-center truncate">Questions</h1>
        <div className="flex items-center space-x-2">
          
          <Link
                  to={"/admin/question/new/" + data.id}
                  className="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>

                  <div>New</div>
          </Link>

        </div>
      </div>      
      </div>
      
      <div className="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">            
              <QuestionsTable items={data.items}/>
      </div>
      
      {/* <Outlet /> */}
      </div>      
  );
}
