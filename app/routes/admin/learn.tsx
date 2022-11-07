import { useTranslation } from "react-i18next";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostsTable from "~/components/learn/PostsTable";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";

import { useAdminData } from "~/utils/data/useAdminData";
import { LearnPostWithDetails, getAllLearnPosts } from "~/utils/db/learn.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/PermissionsHelper";

type LoaderData = {
  title: string;
  items: any;//LearnPostWithDetails[];
};

export let loader: LoaderFunction = async ({ request }) => {
  // await verifyUserHasPermission(request, "admin.blog.view");
  
  const items = await getAllLearnPosts();

  const data: LoaderData = {
    title: `${"Learns"} | ${process.env.APP_NAME}`,
    items,
  };
  return json(data);
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function Events() {
  
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();

  return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">Learns</h1>
          <div className="flex items-center space-x-2">
            <ButtonSecondary to="/blog" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <div>Preview</div>
            </ButtonSecondary>
            <ButtonSecondary to=".">
              <span>Reload</span>
            </ButtonSecondary>
            <ButtonPrimary disabled={!adminData.permissions.includes("admin.blog.create")} to={"/admin/learn/new"}>
              <span>Write</span>
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostsTable items={data.items} />
      </div>
    </div>
  );
}
