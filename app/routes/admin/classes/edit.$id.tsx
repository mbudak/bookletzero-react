import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { FormEvent, Fragment, useEffect, useRef, useState } from "react";

import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import { useEscapeKeypress } from "~/utils/shared/KeypressUtils";

import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/server-runtime";




import { getUserInfo } from "~/utils/session.server";
import clsx from "clsx";
import { useAppData } from "~/utils/data/useAppData";
import { Form, useActionData, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { getQuestionClass, questionClassUpdate } from "~/utils/db/questionClass.db.server";

export const meta: MetaFunction = () => ({
  title: "Edit Question Class | Remix SaasFrontend",
});

type LoaderData = {
  questionClass: any
};

export let loader: LoaderFunction = async ({ request, params }) => {
  if (!params.id) {
    return null;
  }
  const userInfo = await getUserInfo(request);
  
  const questionClass = await getQuestionClass(params.id);

  // const member = await getTenantUser(params.id);
  // const userWorkspaces = await getUserWorkspaces(userInfo?.currentTenantId, member?.userId);
  // const tenantWorkspaces = await getWorkspaces(userInfo?.currentTenantId);
  const data: LoaderData = {
    questionClass
    // member,
    // userWorkspaces: userWorkspaces?.map((f) => f.workspace) ?? [],
    // tenantWorkspaces,
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

const badRequest = (data: ActionData) => json(data, { status: 400 });
const unauthorized = (data: ActionData) => json(data, { status: 401 });
export const action: ActionFunction = async ({ request, params }) => {
  

  const { id } = params;
  if (!id) {
    return badRequest({
      error: "Not found",
    });
  }
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const type = form.get("type")?.toString();
  const title = form.get("title")?.toString();
  
  
  

  if (type === "edit") {
    
    // const tenantUser = await getTenantUser(id);
    // if (!tenantUser) {
    //   return badRequest({
    //     error: "Not found",
    //   });
    // }

    if (title) {
      await questionClassUpdate(id, { title : title  });
    }

    // await updateTenantUser(id, { role });
    // workspaces.forEach(async (workspaceId) => {
    //   const workspace = await getWorkspace(workspaceId);
    //   console.log({ workspace: workspace?.name });
    // });
    // await updateUsersWorkspaces(tenantUser?.userId, workspaces);

    return redirect("/admin/classes");
  } else if (type === "delete") {
    /*
    try {
      await deleteTenantUser(id);
    } catch (e: any) {
      return badRequest({
        error: e.toString(),
      });
    }
    */
    return redirect("/admin/classes");
  }
};

interface Props {
  maxSize?: string;
}

export default function EditMemberRoute({ maxSize = "sm:max-w-lg" }: Props) {
  const appData = useAppData();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { t } = useTranslation("translations");
  const navigate = useNavigate();
  const submit = useSubmit();
  const transition = useTransition();
  const loading = transition.state === "submitting" || transition.state === "loading";

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  // const selectWorkspaces = useRef<RefSelectWorkspaces>(null);
  const confirmRemove = useRef<RefConfirmModal>(null);

  // const [item, setItem] = useState<TenantUserDto | null>(null);
  const [showing, setShowing] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [phone, setPhone] = useState("");

  // const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    if (actionData?.error) {
      errorModal.current?.show(actionData.error);
    }
    if (actionData?.success) {
      successModal.current?.show(t("shared.success"), actionData.success);
    }
  }, [actionData]);

  useEffect(() => {
    setShowing(true);
    // setWorkspaces(data.userWorkspaces ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    navigate("/admin/classes");
  }
  function save(e: FormEvent) {
    e.preventDefault();
    // if (workspaces.length === 0) {
    //   errorModal.current?.show(t("shared.error"), t("account.tenant.members.errors.atLeastOneWorkspace"));
    //   return;
    // }
  }
  function remove() {
    confirmRemove.current?.show("Are you sure to remove?", "Delete", "Cancel");
  }
  function yesRemove() {
    // if (appData.currentRole === TenantUserRole.MEMBER || appData.currentRole === TenantUserRole.GUEST) {
    //   errorModal.current?.show(t("account.tenant.onlyAdmin"));
    // } else {
      const form = new FormData();
      form.set("type", "delete");
      submit(form, {
        method: "post",
      });
    // }
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
                    <h4 className="text-lg font-medium">Edit</h4>
                  </div>
                  {(() => {
                    if (!data.questionClass) {
                      return <div>Not Found</div>;
                    } else if (data.questionClass) {
                      return (
                        <Form method="post" className="space-y-4">
                          <input hidden type="text" name="type" value="edit" readOnly />
                          <div className="grid grid-cols-2 gap-2">
                            
                            <div className="col-span-2">
                              <label htmlFor="title" className="block text-xs font-medium text-gray-700 truncate">
                                Title
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm w-full">
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  autoComplete="off"                                  
                                  defaultValue={data.questionClass?.title|| actionData?.fields?.title}
                                  className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                  
                                />
                              </div>
                            </div>
                            {/*Title: End */}

                           
                            </div>

                          <div className="flex items-center justify-between mt-4">
                            {(() => {
                              if (loading) {
                                return (
                                  <div className="text-theme-700 text-sm">
                                    <div>Loading...</div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div>
                                    <button
                                      disabled={loading}
                                      className={clsx(
                                        "inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500",
                                        loading && "bg-gray-100 cursor-not-allowed"
                                      )}
                                      type="button"
                                      onClick={remove}
                                    >
                                      <div>Delete</div>
                                    </button>
                                  </div>
                                );
                              }
                            })()}

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
                      );
                    } else {
                      return <div></div>;
                    }
                  })()}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <ConfirmModal ref={confirmRemove} onYes={yesRemove} />
      <ErrorModal ref={errorModal} />
      <SuccessModal ref={successModal} onClosed={close} />
      
    </div>
  );
}
