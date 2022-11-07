import clsx from "clsx";
import { Link } from "@remix-run/react";
import { LearnPostWithDetails } from "~/utils/db/learn.db.server";
import DateUtils from "~/utils/shared/DateUtils";

interface Props {
  items: LearnPostWithDetails[];
  withCoverImage: boolean;
}

export default function LearnList({ items, withCoverImage }: Props) {
  return (
    <div
      className={clsx(
        "mt-12 mx-auto grid gap-5 max-w-lg",
        items.length === 1 && "lg:grid-cols-1 max-w-md",
        items.length === 2 && "lg:grid-cols-2 max-w-4xl",
        items.length > 2 && "lg:grid-cols-3 lg:max-w-none"
      )}
    >
      {items.map((post) => (
        <div key={post.title} className="flex flex-col rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          {withCoverImage && (
            <Link to={"/learn/" + post.slug} className="flex-shrink-0">
              <img className={clsx("h-48 w-full", items.length <= 2 && "object-contain", items.length > 2 && "object-cover")} src={post.image} alt="" />
            </Link>
          )}
          <div className="flex-1 bg-white dark:bg-gray-900 p-6 flex flex-col justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                <span>{post.category.name}</span>
              </p>
              <Link to={"/learn/" + post.slug} className="block mt-2">
                <p className="text-xl font-semibold ">{post.title}</p>
                <p className="mt-3 text-base text-gray-500">{post.description}</p>
              </Link>
            </div>
            <div className="mt-6 flex items-center">
              
              <div className="w-3/4">
                <p className="text-sm font-medium ">
                  <span>
                    {/* {post.author.firstName} {post.author.lastName} */}
                  </span>
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  {/* <time dateTime={DateUtils.dateYMD(post.date)}>{DateUtils.dateYMD(post.date)}</time>*/}
                  {post.totalQuestions && (
                    <>
                      {/* <span aria-hidden="true">&middot;</span>*/}
                      <span><b>{post.totalQuestions}</b> questions</span>
                    </>
                  )}
                  
                </div>
              </div>
              <div className="w-1/4 items-end text-end text-right">
                
                <div className="space-x-1 text-sm text-gray-500">
                <Link to={"/learn/" + post.slug}>
                  <button type="button" className="py-2 px-3 text-xs font-medium text-center text-gray-900 border border-gray-800 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    {post.prices[0] && (
                      <span>${post.prices[0].price}</span>
                    )} 
                    {!post.prices[0] && (
                      <span>FREE</span>
                    )}
                    
                  </button>
                </Link>

                
                </div>
              </div>
            </div>

            
          </div>
        </div>
      ))}
    </div>
  );
}
