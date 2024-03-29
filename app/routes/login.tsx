import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession, getUserInfo, setLoggedUser } from "~/utils/session.server";
import bcrypt from "bcryptjs";
import Logo from "~/components/front/Logo";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import { useTranslation } from "react-i18next";

import { getUser, getUserByEmail } from "~/utils/db/users.db.server";
import UserUtils from "~/utils/app/UserUtils";
import InfoBanner from "~/components/ui/banners/InfoBanner";
import { useState } from "react";

export let loader: LoaderFunction = async ({ request }) => {  
  const userInfo = await getUserInfo(request);
  
  if (userInfo.userId !== undefined && userInfo.userId !== "") {
    const user = await getUser(userInfo.userId);
    if (user) {
      return redirect('/app');
    }
  }

  return json({
    title: `Login | ${process.env.APP_NAME}`
  });
};

type ActionData = {
  error?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);


  const form = await request.formData();
  const email = form.get("email")?.toString().toLowerCase().trim();
  const password = form.get("password");
  const redirectTo = form.get("redirectTo");
  if (typeof email !== "string" || typeof password !== "string" || typeof redirectTo !== "string") {
    return badRequest({
      error: "Invalid Form",
    });
  }

  const fields = { email, password };
  const fieldErrors = {
    email: !UserUtils.validateEmail(email) ? "Invalid email" : undefined,
    password: !UserUtils.validatePassword(password) ? "Invalid password" : undefined,
  };
  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields });

  const user = await getUserByEmail(email);
  if (!user) {
    return badRequest({
      fields,
      error: "User not registered",
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return badRequest({
      fields,
      error: "Invalid password",
    });
  }

  // await createLogLogin(request, user);
  const userSession = await setLoggedUser(user);

  return createUserSession(
    {
      ...userSession,
      lng: userInfo.lng,
      cookies: userInfo.cookies,
    },
    "/account/dashboard"
  );
  
 
};

export const meta: MetaFunction = ({ data }) => ({
  title: data?.title,
});

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  let { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo className="mx-auto h-12 w-auto" />
            <h1 className="mt-6 text-center text-lg font-extrabold text-gray-800 dark:text-slate-200">{t("account.login.title")}</h1>
            <p className="mt-2 text-center text-sm text-gray-500">
              {/*
              <span>{t("shared.or")} </span>
              <Link to="/register" className="font-medium text-theme-500 hover:text-theme-400">
                {t("account.login.orStartTrial", [90])}
              </Link>
              */}
            </p>
          </div>
          
          <Form className="mt-8 space-y-6" method="post">
            <input type="hidden" name="redirectTo" value={searchParams.get("redirect") ?? undefined} />
            <div className="rounded-sm shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-t-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  placeholder="email"
                  defaultValue={actionData?.fields?.email}
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  aria-errormessage={actionData?.fieldErrors?.email ? "email-error" : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {actionData?.fieldErrors?.email ? (
                  <p className="text-rose-500 text-xs py-2" role="alert" id="email-error">
                    {actionData.fieldErrors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-gray-800 dark:text-slate-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  placeholder="password"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
                  aria-errormessage={actionData?.fieldErrors?.password ? "password-error" : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {actionData?.fieldErrors?.password ? (
                  <p className="text-rose-500 text-xs py-2" role="alert" id="password-error">
                    {actionData.fieldErrors.password}
                  </p>
                ) : null}
              </div>

              <div id="form-error-message">
                {actionData?.error ? (
                  <p className="text-rose-500 text-xs py-2" role="alert">
                    {actionData.error}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <LoadingButton className="w-full block" type="submit">
                <span className="absolute left-0 inset-y pl-3">
                  <svg className="h-5 w-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {t("account.login.button")}
              </LoadingButton>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-theme-500 hover:text-theme-400">
                  Forgot your login information?
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
