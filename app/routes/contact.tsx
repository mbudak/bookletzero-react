import Footer from "~/components/front/Footer";
import Header from "~/components/front/Header";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import { useState } from "react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";


export let loader: LoaderFunction = async ({ request }) => {
  return json({
    title: `${"Contact"} | ${process.env.APP_NAME}`,    
    actionUrl: process.env.INTEGRATIONS_CONTACT_FORMSPREE?.toString() ?? "",
  });
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function ContactRoute() {
  
  const data = useLoaderData();

  const usersOptions = ["1", "2 - 3", "4 - 10", "11 - 25", "26 - 50", "51 - 100", "+100"];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [users, setUsers] = useState("");
  const [comments, setComments] = useState("");

  return (
    <div>
      <div>
        <Header />
        <div className="bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col sm:align-center">
              <div className="relative max-w-xl mx-auto py-12 sm:py-6 w-full overflow-hidden px-2">
                <svg className="absolute left-full transform translate-x-1/2" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
                  <defs>
                    <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-gray-200 dark:text-black" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
                </svg>
                <svg
                  className="absolute right-full bottom-0 transform -translate-x-1/2"
                  width="404"
                  height="404"
                  fill="none"
                  viewBox="0 0 404 404"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" className="text-gray-200 dark:text-black" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
                </svg>
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-slate-200 sm:text-4xl">Contact us</h1>
                  <p className="mt-4 text-lg leading-6 text-gray-500">to contact us, please use the form</p>
                </div>
                {/* <div className="flex justify-center mt-6">
                  <Tabs
                    breakpoint="sm"
                    tabs={[
                      {
                        name: t("blog.title"),
                        routePath: "/blog",
                      },
                      {
                        name: t("front.changelog.title"),
                        routePath: "/changelog",
                      },
                      // {
                      //   name: t("front.newsletter.title"),
                      //   routePath: "/newsletter",
                      // },
                      {
                        name: t("front.contact.title"),
                        routePath: "/contact",
                      },
                    ]}
                  />
                </div> */}
                <div className="mt-12">
                  {!data.actionUrl && <WarningBanner title="Form Url Not set" text="Setup your INTEGRATIONS_CONTACT_FORMSPREE url in environment settings" />}
                  <form action={data.actionUrl} method="POST" className="mt-9 grid grid-cols-1 gap-x-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-900 dark:text-slate-300">
                        First Name
                      </label>
                      <div className="mt-1">
                        <input
                          required
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                          type="text"
                          name="first_name"
                          id="first_name"
                          autoComplete="given-name"
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-900 dark:text-slate-300">
                        Last Name
                      </label>
                      <div className="mt-1">
                        <input
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                          type="text"
                          name="last_name"
                          id="last_name"
                          autoComplete="family-name"
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-slate-300">
                        E-mail
                      </label>
                      <div className="mt-1">
                        <input
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-900 dark:text-slate-300">
                          Organization
                        </label>
                        <span id="company_description" className="text-sm text-gray-500">
                          Optional
                        </span>
                      </div>
                      <div className="mt-1">
                        <input
                          value={organization}
                          onChange={(e) => {
                            setOrganization(e.target.value);
                          }}
                          type="text"
                          name="company"
                          id="company"
                          autoComplete="organization"
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        />
                      </div>
                    </div>

                    <fieldset className="sm:col-span-2">
                      <legend className="block text-sm font-medium text-gray-900 dark:text-slate-300">How many users</legend>
                      <div className="mt-4 grid grid-cols-1 gap-y-4">
                        <select
                          id="users"
                          required
                          value={users}
                          onChange={(e) => {
                            setUsers(e.target.value);
                          }}
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        >
                          {usersOptions.map((option, idx) => {
                            return (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </fieldset>

                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-900 dark:text-slate-300">
                          Comments
                        </label>
                      </div>
                      <div className="mt-1">
                        <textarea
                          required
                          value={comments}
                          onChange={(e) => {
                            setComments(e.target.value);
                          }}
                          id="comments"
                          name="comments"
                          aria-describedby="comments_description"
                          rows={4}
                          className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border-gray-300 dark:border-gray-600 placeholder-gray-500 rounded-b-sm focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>

                    <div className="text-right sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-theme-500 hover:bg-theme-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
