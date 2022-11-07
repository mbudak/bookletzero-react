import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import UploadImage from "~/components/ui/uploaders/UploadImage";
import { ActionFunction, json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useSubmit, useTransition } from "@remix-run/react";
import { updateUserPassword, updateUserProfile } from "~/utils/db/users.db.server";
import { getUserInfo } from "~/utils/session.server";
import UploadDocuments from "~/components/ui/uploaders/UploadDocument";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";


import { useAccountData } from "~/utils/data/useAccountData";


type LoaderData = {
  title: string;
};

export let loader: LoaderFunction = async ({ request }) => {
  
  const data: LoaderData = {
    title: `${"Profile"} | ${process.env.APP_NAME}`,
  };
  return json(data);
};

type ActionData = {
  profileSuccess?: string;
  profileError?: string;
  passwordSuccess?: string;
  passwordError?: string;
  deleteError?: string;
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
  };
  fields?: {
    action: string;
    firstName: string | undefined;
    lastName: string | undefined;
    avatar: string | undefined;
    passwordCurrent: string | undefined;
    passwordNew: string | undefined;
    passwordNewConfirm: string | undefined;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action");

  const firstName = form.get("firstName")?.toString();
  const lastName = form.get("lastName")?.toString();
  const avatar = form.get("avatar")?.toString() ?? "";

  const passwordCurrent = form.get("passwordCurrent")?.toString();
  const passwordNew = form.get("passwordNew")?.toString();
  const passwordNewConfirm = form.get("passwordNewConfirm")?.toString();

  if (typeof action !== "string") {
    return badRequest({
      profileError: `Form not submitted correctly.`,
    });
  }

  const user = await db.user.findUnique({
    where: { id: userInfo?.userId },    
  });

  switch (action) {
    case "profile": {
      const fields = { action, firstName, lastName, avatar, passwordCurrent, passwordNew, passwordNewConfirm };
      const fieldErrors = {
        firstName: action === "profile" && (fields.firstName?.length ?? "") < 2 ? "First name required" : "",
        lastName: action === "profile" && (fields.lastName?.length ?? "") < 2 ? "Last name required" : "",
      };
      if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields });

      if (typeof firstName !== "string" || typeof lastName !== "string") {
        return badRequest({
          profileError: `Form not submitted correctly.`,
        });
      }

      

      const profile = await updateUserProfile({ firstName, lastName, avatar }, userInfo?.userId);

      if (!profile) {
        return badRequest({
          fields,
          profileError: `Could not update profile`,
        });
      }
      return json({
        profileSuccess: "Profile updated",
      });
    }
    case "password": {
      if (typeof passwordCurrent !== "string" || typeof passwordNew !== "string" || typeof passwordNewConfirm !== "string") {
        return badRequest({
          passwordError: `Form not submitted correctly.`,
        });
      }

      if (passwordNew !== passwordNewConfirm) {
        return badRequest({
          passwordError: `Passwords don't match.`,
        });
      }

      if (passwordNew.length < 6) {
        return badRequest({
          passwordError: `Passwords must have least 6 characters.`,
        });
      }

      if (!user) return null;

      

      const isCorrectPassword = await bcrypt.compare(passwordCurrent, user.passwordHash);
      if (!isCorrectPassword) {
        return badRequest({
          passwordError: `Invalid password.`,
        });
      }

      const passwordHash = await bcrypt.hash(passwordNew, 10);
      await updateUserPassword({ passwordHash }, userInfo?.userId);

      return json({
        passwordSuccess: "Password updated",
      });
    }
    case "deleteAccount": {
      if (!user) {
        return null;
      }
      

      try {
        // await deleteUserWithItsTenants(user.id);
      } catch (e: any) {
        return badRequest({
          deleteError: e,
        });
      }

      // return redirect("/login");
    }
  }
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function ProfileRoute() {
  const accountData = useAccountData();
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const submit = useSubmit();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  const confirmModal = useRef<RefConfirmModal>(null);

  const inputFirstName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFirstName.current?.focus();
    inputFirstName.current?.select();
  }, []);

  
  const [avatar, setAvatar] = useState<string | undefined>(accountData.user?.avatar ?? undefined);
  
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  function changedLocale(locale: string) {
  
    const form = new FormData();
    form.set("action", "setLocale");
    form.set("redirect", location.pathname);
    form.set("lng", locale);
    submit(form, { method: "post", action: "/" });
  }

  function deleteAccount() {    
      confirmModal.current?.show("Are you sure to delete your account?", "Confirm", "Cancel", "This action cannot reverse");
  }

  function confirmDelete() {
    const form = new FormData();
    form.set("action", "deleteAccount");
    submit(form, { method: "post" });
  }
  function loadedImage(image: string | undefined) {
    setAvatar(image);
    setUploadingImage(true);
  }

  return (
    <div className="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>
        
        {/*Profile */}
        <div className="md:grid lg:grid-cols-3 md:gap-2">
          <div className="md:col-span-1">
            <div className="sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">User Profile</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Form method="post">
              <input hidden type="text" name="action" value="profile" readOnly />
              <div className="shadow overflow-hidden sm:rounded-sm">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-6 sm:col-span-6 md:col-span-6">
                      <label htmlFor="email_address" className="block text-sm font-medium leading-5 text-gray-700">
                        Email
                      </label>
                      <input
                        required
                        disabled={true}
                        type="email"
                        id="email-address"
                        name="email"
                        defaultValue={accountData.user?.email}
                        className="bg-gray-100 mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium leading-5 text-gray-700">
                        First Name
                      </label>
                      <input
                        ref={inputFirstName}
                        id="firstName"
                        name="firstName"
                        required
                        defaultValue={accountData.user?.firstName}
                        aria-invalid={Boolean(actionData?.fieldErrors?.firstName)}
                        aria-errormessage={actionData?.fieldErrors?.firstName ? "firstName-error" : undefined}
                        className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                      {actionData?.fieldErrors?.firstName ? (
                        <p className="text-rose-500 text-xs py-2" role="alert" id="firstName-error">
                          {actionData.fieldErrors.firstName}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-span-6 md:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium leading-5 text-gray-700">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        defaultValue={accountData.user?.lastName}
                        aria-invalid={Boolean(actionData?.fieldErrors?.lastName)}
                        aria-errormessage={actionData?.fieldErrors?.lastName ? "lastName-error" : undefined}
                        className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                      {actionData?.fieldErrors?.lastName ? (
                        <p className="text-rose-500 text-xs py-2" role="alert" id="lastName-error">
                          {actionData.fieldErrors.lastName}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-span-6 sm:col-span-6">
                      <label htmlFor="avatar" className="block text-sm leading-5 font-medium text-gray-700">
                        Avatar
                      </label>
                      <div className="mt-2 flex items-center space-x-3">
                        <input hidden id="avatar" name="avatar" defaultValue={avatar ?? actionData?.fields?.avatar} />
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          {(() => {
                            if (avatar) {
                              return <img id="avatar" alt="Avatar" src={avatar} />;
                            } else {
                              return (
                                <svg id="avatar" className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              );
                            }
                          })()}
                        </div>

                        {avatar ? (
                          <ButtonTertiary destructive={true} onClick={() => loadedImage("")} type="button">
                            Delete
                          </ButtonTertiary>
                        ) : (
                          <UploadDocuments accept="image/png, image/jpg, image/jpeg" onDropped={loadedImage} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <div className="flex justify-between">
                    <div id="form-success-message" className="flex space-x-2 items-center">
                      {actionData?.profileSuccess ? (
                        <>
                          <p className="text-teal-500 text-sm py-2" role="alert">
                            {actionData.profileSuccess}
                          </p>
                        </>
                      ) : actionData?.profileError ? (
                        <p className="text-red-500 text-sm py-2" role="alert">
                          {actionData?.profileError}
                        </p>
                      ) : null}
                    </div>
                    <button
                      disabled={transition.state === "submitting"}
                      type="submit"
                      className="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        {/*Security */}
        <div className="md:grid lg:grid-cols-3 md:gap-2">
          <div className="md:col-span-1">
            <div className="sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Security</h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                {"Account forgot? "}
                <a className="text-theme-600 font-bold hover:text-theme-500" href={"/forgot-password?e=" + accountData.user?.email ?? ""}>
                  Reset
                </a>
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Form method="post">
              <input hidden type="text" name="action" value="password" readOnly />
              <div className="shadow overflow-hidden sm:rounded-sm">
                <div>
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-6 sm:col-span-6">
                        <label htmlFor="passwordCurrent" className="block text-sm font-medium leading-5 text-gray-700">
                          Current password
                        </label>
                        <input
                          required
                          type="password"
                          id="passwordCurrent"
                          name="passwordCurrent"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">
                          New password
                        </label>
                        <input
                          required
                          type="password"
                          id="passwordNew"
                          name="passwordNew"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-3">
                        <label htmlFor="passwordConfirm" className="block text-sm font-medium leading-5 text-gray-700">
                          Confirm password
                        </label>
                        <input
                          required
                          type="password"
                          id="passwordNewConfirm"
                          name="passwordNewConfirm"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <div className="flex space-x-2 justify-between">
                      <div id="form-success-message" className="flex space-x-2 items-center">
                        {actionData?.passwordSuccess ? (
                          <p className="text-teal-500 text-sm py-2" role="alert">
                            {actionData.passwordSuccess}
                          </p>
                        ) : actionData?.passwordError ? (
                          <p className="text-red-500 text-sm py-2" role="alert">
                            {actionData?.passwordError}
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex space-x-2 items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        {/*Preferences */}
        <div className="md:grid lg:grid-cols-3 md:gap-2">
          <div className="md:col-span-1">
            <div className="sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Preferences</h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">More preferences</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-sm">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-6 sm:col-span-6">
                    <label htmlFor="locale" className="block text-sm font-medium leading-5 text-gray-700">
                      Language
                    </label>
                    <select
                      id="locale"
                      required
                      value="en"
                      onChange={(e) => changedLocale(e.currentTarget.value)}
                      className="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                    >
                      
                        return (
                          <option key={"en"} value="English">
                            English
                          </option>
                          <option key={"fr"} value="French">
                            French
                          </option>
                        );
                      
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        {/*Danger */}
        <div className="md:grid lg:grid-cols-3 md:gap-2">
          <div className="md:col-span-1">
            <div className="sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Danger zone</h3>
              <p className="mt-1 text-xs leading-5 text-gray-600">Be careful what you do here</p>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:col-span-2">
            <div>
              <input hidden type="text" name="action" value="deleteAccount" readOnly />
              <div className="bg-white shadow sm:rounded-sm">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Delete your account?</h3>
                  <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
                    <p>Once you delete your account, you will lose all data associated with it.</p>
                  </div>
                  <div className="mt-5">
                    <ButtonPrimary destructive={true} onClick={deleteAccount}>
                      Delete
                    </ButtonPrimary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showUploadImage && !uploadingImage && (
        <UploadImage onClose={() => setShowUploadImage(false)} title="Avatar" initialImage={avatar} onLoaded={loadedImage} />
      )}
      <SuccessModal ref={successModal} />
      <ErrorModal ref={errorModal} />
      <ConfirmModal ref={confirmModal} onYes={confirmDelete} />
    </div>
  );
}
