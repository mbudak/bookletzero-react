import Footer from "~/components/front/Footer";
import Header from "~/components/front/Header";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import LearnList from "~/components/learn/LearnList";
import { LearnPostWithDetails, getAllLearnPosts } from "~/utils/db/learn.db.server";


type LoaderData = {
    title: string;  
    posts: any; // LearnPostWithDetails[];
  };

  
export const meta: MetaFunction = ({ data }) => ({
    title: data.title,
  });

export let loader: LoaderFunction = async ({ request }) => {    
    const posts = await getAllLearnPosts(true);
    const data: LoaderData = {
        title: `${"Learn"} | ${process.env.APP_NAME}`,        
        posts,
      };
      return json(data);
}
  
export default function LearnRoute() {
    const { posts } = useLoaderData<LoaderData>();    
    return (
        <div className="relative">
            <Header />

            <div className="bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-12 sm:py-6">
                    <div className="sm:flex sm:flex-col sm:align-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl">Learn Booklets</h1>
                            <p className="mt-4 text-lg leading-6 text-gray-600 dark:text-gray-400">Find your exambooklet about your subject</p>
                        </div>

                        <div className="px-4">
                            <LearnList items={posts} withCoverImage={true} />
                            
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}



