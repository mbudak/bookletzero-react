import { Link } from "@remix-run/react";
import clsx from "clsx";
import CheckIcon from "../ui/icons/CheckIcon";

const groups = [
    {
      headline: "Exam Questions Database",
      subheadline: "Powered by the best tools",
      description: "Each question categories maintenance by professionals, weekly.",
      items: [
        {
          name: "Multiple Selection",
          description: "Questions are designed by multiple selection to specifically designed for printing",
          link: "#",
        },
        {
          name: "PDF Format",
          description: "Download your exam by PDF format. So you can read it on your favourite e-reader or just print them on paper",
          link: "#",
        },
        {
          name: "Booklet Design",
          description: "Carefully designed PDF booklets fit your favourite format. Letter, A4 or your e-reader.",
          link: "#",
        },
        {
          name: "Direct to Learn",
          description: "If you dont understand specific question and need to understand it well, follow the link on booklet",
          link: "#",
        },
      ],
      // for more item use here...
    }
  ];

export default function () {
    return (
        <section id="features">
        {groups.map((group) => {
          return (
            <div key={group.headline} className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
              <div className="z-50">
                {/* <h2 className="text-base font-semibold text-theme-600 uppercase tracking-wide">{group.subheadline}</h2> */}
                <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">{group.headline}</p>
                <p className="mt-4 text-lg text-gray-500">{group.description}</p>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-2">
                <dl
                  className={clsx(
                    "space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:grid-flow-col sm:gap-x-6 sm:gap-y-10 lg:gap-x-8",
                    group.items.length <= 2 && "sm:grid-rows-1",
                    group.items.length > 2 && group.items.length <= 4 && "sm:grid-rows-2",
                    (group.items.length === 5 || group.items.length === 6) && "sm:grid-rows-3",
                    group.items.length > 6 && "sm:grid-rows-5",
                    group.items.length > 10 && "sm:grid-rows-6"
                  )}
                >
                  {group.items.map((feature) => (
                    <div key={feature.name} className="relative">
                      <dt>
                        <CheckIcon className="absolute h-6 w-6 text-theme-500" aria-hidden="true" />
                        <p className="ml-9 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
                      </dt>
                      <dd className="mt-2 ml-9 text-base text-gray-500">
                        {feature.description}{" "}
                        {feature.link && (
                          <div>
                            {feature.link.startsWith("http") ? (
                              <a
                                className="mt-2 inline-flex items-center py-1 px-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-accent-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-accent-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 no-underline"
                                href={feature.link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Read Docs
                              </a>
                            ) : (
                              <Link
                                className="mt-2 inline-flex items-center py-1 px-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-accent-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-accent-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 no-underline"
                                to={feature.link}
                              >
                                More...
                              </Link>
                            )}
                          </div>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          );
        })}
      </section>
    )
}