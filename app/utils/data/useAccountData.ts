import { redirect } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { getUserInfo } from "../session.server";
import { getUser } from "../db/users.db.server";

import UrlUtils from "../app/UrlUtils";
// import { getAllEntities } from "../db/entities/entities.db.server";
// import { getMyTenants } from "../db/tenants.db.server";
// import { getUserRoles } from "../db/permissions/userRoles.db.server";
import { AppOrAdminData } from "./useAppOrAdminData";
// import { getAllRoles } from "../db/permissions/roles.db.server";
// import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";
// import { getMyGroups } from "../db/permissions/groups.db.server";

export type AccountLoaderData = AppOrAdminData;

export function useAccountData(): AccountLoaderData {
  const paths: string[] = ["routes/account"];
  return (useMatches().find((f) => paths.includes(f.id.toLowerCase()))?.data ?? {}) as AccountLoaderData;
}

export async function loadAccountData(request: Request) {
  
  const userInfo = await getUserInfo(request);
  if (UrlUtils.stripTrailingSlash(new URL(request.url).pathname) === `/account`) {
    throw redirect(`/account/dashboard`);
  }
  const user = await getUser(userInfo?.userId);
  const redirectTo = new URL(request.url).pathname;
  if (!userInfo || !user) {
    let searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  
  const data: AccountLoaderData = {    
    user,
  };
  return data;
}
