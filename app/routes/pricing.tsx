import Header from "~/components/front/Header";
// import Plans from "~/components/core/settings/subscription/Plans";
import Footer from "~/components/front/Footer";
import { useTranslation } from "react-i18next";
// import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
// import plans from "~/application/pricing/plans.server";

import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import TopBanner from "~/components/ui/banners/TopBanner";

type LoaderData = {
  title: string;  
  // items: SubscriptionProductDto[];
};
export let loader: LoaderFunction = async ({ request }) => {
  
  // const items = await getAllSubscriptionProducts(true);
  const data: LoaderData = {
    title: `${"Pricing"} | ${process.env.APP_NAME}`,
    
    // items: items.length > 0 ? items : plans,
  };
  return json(data);
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function PricingRoute() {
  const data = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  return (
    <div>
      <div>
        
        <Header />
        <div className="bg-white dark:bg-gray-900 pt-6 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl">Pricing Title</h1>
              <p className="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-400">Pricing Headline</p>
            </div>
            Items here...
            {/*
                {data?.items && <Plans items={data.items} />}
            */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
