import { useTranslation } from "react-i18next";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import { useRef, useEffect, useState } from "react";
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getUserInfo } from "~/utils/session.server";
import { getAllSubscriptionsByUser } from "~/utils/db/learn.db.server";
import DateUtils from "~/utils/shared/DateUtils";

type LoaderData = {
  title: string;
  posts: any[];
}

export let loader: LoaderFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);
  const posts = await getAllSubscriptionsByUser(userInfo.userId);
  const data: LoaderData = {
    title: `${"Subscriptions"} | ${process.env.APP_NAME}`,
    posts
  };
  
  return json(data);
}

export default function SubscriptionRoute() {
  const { posts } = useLoaderData<LoaderData>();   
  
  return (
    <div className="py-4 space-y-6 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
      
            <div className="mt-12 mx-auto grid gap-5 max-w-lg lg:grid-cols-3 lg:max-w-none">
              {posts.map((item) => (
                 
                 <div key={item.id} className="flex flex-col rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                  
                    <Link to={"/learn/" + item.learnPost.slug} className="flex-shrink-0">
                      <img className="object-cover" src={item.learnPost.image} alt="" />
                    </Link>   

                    <div className="flex-1 bg-white dark:bg-gray-900 p-6 flex flex-col justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                <span>{item.category?.name}</span>
              </p>
              <Link to={"/learn/" + item.slug} className="block mt-2">
                <p className="text-l font-semibold ">{item.learnPost.title}</p>
                <p className="mt-3 text-base text-gray-500">{item.description}</p>
              </Link>
            </div>
            <div className="mt-6 flex items-center">
              
              <div className="w-3/4">
                <p className="text-sm font-medium ">
                  <span>
                    {item.author?.firstName} {item.author?.lastName}
                  </span>
                </p>
              
                <div className="flex space-x-1 text-sm text-gray-500">
                  {/* 
                  <time dateTime={DateUtils.dateYMD(item.date)}>{DateUtils.dateYMD(item.date)}</time>
                  {item.readingTime && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>{item.readingTime} read</span>
                    </>
                  )}
                  */}
                  <span className="text-gray-700">?</span> <span> Exams</span>
                </div>
              </div>
              
               
              <div className="w-1/4 items-end text-end text-right">
                
                <div className="space-x-1 text-sm text-gray-500">
                <Link to={"/learn/" + item.slug}>                  
                  <span className="text-gray-700">??</span> Booklets
                </Link>

                
                </div>
              </div>
              
            </div>

            
          </div>

                 </div>
                









             
               
              ))}
              </div>
      
      
        
      

    
    </div>
  );
}
