import { redirect } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { getUserInfo } from "../session.server";
import { getUser } from "../db/users.db.server";
import UrlUtils from "../app/UrlUtils";
import { getUserRoles } from "../db/permissions/userRoles.db.server";
import { AppOrAdminData } from "./useAppOrAdminData";
import { getAllRoles } from "../db/permissions/roles.db.server";
import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";


export type AdminLoaderData = AppOrAdminData;

export function useAdminData(): AdminLoaderData {
  const paths: string[] = ["routes/admin"];
  return (useMatches().find((f) => paths.includes(f.id.toLowerCase()))?.data ?? {}) as AdminLoaderData;
}

export async function loadAdminData(request: Request) {
  
  const userInfo = await getUserInfo(request);
  if (UrlUtils.stripTrailingSlash(new URL(request.url).pathname) === `/admin`) {
    throw redirect(`/admin/dashboard`);
  }
  const user = await getUser(userInfo?.userId);
  const redirectTo = new URL(request.url).pathname;
  if (!userInfo || !user) {
    let searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  if (!user.admin) {
    throw redirect("/401");
  }

  

  const roles = await getUserRoles(userInfo.userId ?? undefined);
  const permissions: string[] = [];
  roles.forEach((role) => {
    role.role.permissions.forEach((permission) => {
      if (!permissions.includes(permission.permission.name)) {
        permissions.push(permission.permission.name);
      }
    });
  });
  const data: AdminLoaderData = {
    
    user,
    roles,
    allRoles: await getAllRoles("admin"),
    permissions,
    isSuperUser: roles.find((f) => f.role.name === DefaultAdminRoles.SuperAdmin) !== undefined,
    isSuperAdmin: roles.find((f) => f.role.name === DefaultAdminRoles.SuperAdmin) !== undefined,
    
  };
  return data;
}
