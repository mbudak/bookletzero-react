import ProfileBanner from "~/components/app/ProfileBanner";
import { useLoaderData } from "@remix-run/react";
import { AccountLoaderData, loadAccountData, useAccountData } from "~/utils/data/useAccountData";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";


type LoaderData = AccountLoaderData & {
    title: string;    
  };

export let loader: LoaderFunction = async ({ request }) => {
    const accountData = await loadAccountData(request);    
    const data: LoaderData = {
        ...accountData,
        title: `${"Dashboard"} | ${process.env.APP_NAME}`,        
      };
      return json(data);
};

export const meta: MetaFunction = ({ data }) => ({    
    title: data?.title,
  });

  
export default function AccountNavigationRoute() {
    const data = useLoaderData<LoaderData>();

    
    // const accountData = useAccountData();

    return (
        <main className="flex-1 relative pb-8 z-0 overflow-y-auto">
        {/*Page header */}
        <div className="hidden md:block bg-white shadow lg:border-t lg:border-gray-200">
          <ProfileBanner user={data.user}/>
        </div>
        <div>
            Here is the body ...
        </div>
      </main>
    )
}