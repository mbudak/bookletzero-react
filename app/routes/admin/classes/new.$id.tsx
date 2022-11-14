import { useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";

import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import { useEscapeKeypress } from "~/utils/shared/KeypressUtils";
import WarningBanner from "~/components/ui/banners/WarningBanner";

import { loadAppData, useAppData } from "~/utils/data/useAppData";


import { Form,  useActionData, useLoaderData, useTransition } from "@remix-run/react";

import { getUserInfo } from "~/utils/session.server";

import clsx from "clsx";

import { ActionFunction, json, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { AdminLoaderData, loadAdminData } from "~/utils/data/useAdminData";
import { CreateQuestionClass } from "~/utils/db/questionClass.db.server";

export const meta: MetaFunction = () => ({
  
});

type LoaderData = AdminLoaderData & {
  title: string;
  
};

export let loader: LoaderFunction = async ({ request }) => {
  const adminData = await loadAdminData(request);
  
  const data: LoaderData = {
    ...adminData,
    title: `${"New Class"} | ${process.env.APP_NAME}`,  

  };
  return json(data);
};

type ActionData = {
  error?: string;
  success?: string;
  fields?: {
    title: string;
  };
};

// const badRequest = (data: ActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  

  

  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const title = form.get("title")?.toString().trim() ?? "";
  const predecessorId = params.id || "";

  const questionClass = await CreateQuestionClass(userInfo.userId, predecessorId, title);

  return json({
    success: "Record saved",
  });

};

interface Props {
  maxSize?: string;
}

export default function NewMemberRoute({ maxSize = "sm:max-w-lg" }: Props) {
  const appData = useAppData();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  

  const navigate = useNavigate();
  const transition = useTransition();

  const loading = transition.state === "submitting" || transition.state === "loading";

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);

  const inputTitle = useRef<HTMLInputElement>(null);

  const [showing, setShowing] = useState(false);

  

  useEffect(() => {
    if (actionData?.error) {
      errorModal.current?.show(actionData.error);
    }
    if (actionData?.success) {
      successModal.current?.show("Success", actionData.success);
    }
  }, [actionData]);

  useEffect(() => {
    setShowing(true);
    // nextTick(() => {
    if (inputTitle.current) {
      inputTitle.current?.focus();
      inputTitle.current?.select();
    }
    // });
  }, []);

  function close() {
    navigate("/admin/classes", { replace: true });
  }
  
  useEscapeKeypress(close);
  return (
    <div>
      <div>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition
              as={Fragment}
              show={showing}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
              </div>
            </Transition>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
            <Transition
              as={Fragment}
              show={showing}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={clsx(
                  "inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6",
                  maxSize
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="just absolute top-0 right-0 -mt-4 pr-4">
                  <button
                    onClick={close}
                    type="button"
                    className="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">New Class</h4>
                  </div>
                  
                  <Form method="post" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {/*Title */}
                      <div className="col-span-2">
                        <label htmlFor="title" className="block text-xs font-medium text-gray-700 truncate">
                          Title
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm w-full">
                          <input
                            type="text"
                            ref={inputTitle}
                            name="title"
                            id="title"
                            autoComplete="off"
                            required
                            defaultValue={actionData?.fields?.title}
                            disabled={loading}
                            className={clsx(
                              "w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                              loading && "bg-gray-100 cursor-not-allowed"
                            )}
                          />
                        </div>
                      </div>
                      {/*Title: End */}

                      

                      
                     
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-theme-700 text-sm">{loading && <div>Loading...</div>}</div>

                      <div className="flex items-center space-x-2">
                        <button
                          disabled={loading}
                          className={clsx(
                            "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                            loading && "bg-gray-100 cursor-not-allowed"
                          )}
                          type="button"
                          onClick={close}
                        >
                          <div>Cancel</div>
                        </button>
                        <button
                          disabled={loading}
                          className={clsx(
                            "inline-flex items-center px-3 py-2 border space-x-2 border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                            loading && "opacity-50 cursor-not-allowed"
                          )}
                          type="submit"
                        >
                          <div>Save</div>
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <ErrorModal ref={errorModal} />
      <SuccessModal ref={successModal} onClosed={close} />
      
    </div>
  );
}
