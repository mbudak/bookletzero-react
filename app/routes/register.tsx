import { ActionFunction, json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getUserInfo, setLoggedUser, validateCSRFToken } from "~/utils/session.server";
import Logo from "~/components/front/Logo";
import LoadingButton from "~/components/ui/buttons/LoadingButton";


import { useRootData } from "~/utils/data/useRootData";
import clsx from "clsx";
import { createRegistrationForm, validateRegistrationForm } from "~/utils/services/authService";



export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export let loader: LoaderFunction = async ({ request }) => {

  return json({
    title: `Register | ${process.env.APP_NAME}`,    
  });
};

type ActionData = {
  error?: string;
  verificationEmailSent?: boolean;
};

const success = (data: ActionData) => json(data, { status: 200 });
const badRequest = (data: ActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {  
  const userInfo = await getUserInfo(request);
  
  try {
    await validateCSRFToken(request);
    const result = await validateRegistrationForm(request);

    if (result.verificationRequired) {
      await createRegistrationForm({ ...result.form, recreateToken: false });
      return success({ verificationEmailSent: true });
    } else if (result.registered) {
      const userSession = await setLoggedUser(result.registered.user);
      return createUserSession(
        {
          ...userSession,          
          lng: userInfo.lng,
          cookies: userInfo.cookies,
        },
        `/account/dashboard`
      );
    }
    
    return badRequest({ error: "Unknown Error" });
  } catch (e: any) {
    return badRequest({ error: e.message });
    // return badRequest({ error: "Bad request" });
  }
  
};

export default function RegisterRoute() {
  const { appConfiguration, userSession, csrf } = useRootData();
  const actionData = useActionData<ActionData>();
  

  const [searchParams] = useSearchParams();
  

  

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo className="mx-auto h-12 w-auto" />
          </div>
          {!actionData?.verificationEmailSent ? (
            <>
              <h1 className="mt-6 text-center text-lg leading-9 font-bold text-gray-800 dark:text-slate-200">Account Register</h1>
              <p className="mt-2 text-center text-sm leading-5 text-gray-800 dark:text-slate-200 max-w">
                {"Already registered "}
                <span className="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150">
                  <Link to="/login">Click here to login</Link>
                </span>
              </p>

              <Form className="mt-8 space-y-6" method="post">
                <input type="hidden" hidden readOnly name="csrf" value={csrf} />               
                <input type="hidden" name="redirectTo" value={searchParams.get("redirect") ?? undefined} />
            
                {/* Personal Info */}
                <div>
                  <legend className="block text-sm font-medium">Personal info</legend>
                  <div className="mt-1 rounded-sm shadow-sm -space-y-px">
                   
                    <div>
                      <label htmlFor="email" className="sr-only">
                        e-mail
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="email"
                        className={clsx(
                          "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm",
                          appConfiguration.auth.requireEmailVerification && "rounded-b-md"
                          
                        )}
                      />
                    </div>
                    {!appConfiguration.auth.requireEmailVerification && (
                      <>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          required
                          placeholder="password"
                          className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        />
                      </>
                    )}
                  </div>
                  <div id="form-error-message">
                    {actionData?.error ? (
                      <p className="text-rose-500 text-xs py-2" role="alert">
                        {actionData.error}
                      </p>
                    ) : null}
                  </div>
                </div>
                {/* Personal Info: End */}

                <div>
                  <LoadingButton className="w-full block" type="submit">
                    Register 
                  </LoadingButton>
                </div>
                <p className="mt-3 py-2 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700">
                    {"By signing up "}
                  <a target="_blank" href="/terms-and-conditions" className="text-theme-500 underline">
                    Terms and Conditions
                  </a>{" "}
                  {"and "}
                  <a target="_blank" href="/privacy-policy" className="text-theme-500 underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </Form>
            </>
          ) : (
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="max-w-md w-full mx-auto rounded-sm px-8 pb-8 mb-4">
                <div className="text-xl font-black">
                  <h1 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">Account Verify</h1>
                </div>
                <div className="my-4 leading-tight">
                  <p className="mt-2 text-center text-sm leading-5 text-gray-900 dark:text-slate-300 max-w">Email sent</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

