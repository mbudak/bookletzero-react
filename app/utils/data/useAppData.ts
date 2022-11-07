import { redirect } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { UserType } from "~/application/enums/UserType";
import { getUserInfo } from "../session.server";
// import { getLinkedAccountsCount } from "../db/linkedAccounts.db.server";
// import { LinkedAccountStatus } from "~/application/enums/tenants/LinkedAccountStatus";
// import { getMyTenants, getTenant, TenantWithDetails } from "../db/tenants.db.server";
import { getUser } from "../db/users.db.server";

import UrlUtils from "../app/UrlUtils";
// import { getTenantUrl } from "../services/urlService";
// import { getTenantSubscription, TenantSubscriptionWithDetails } from "../db/tenantSubscriptions.db.server";
// import { getAllEntities } from "../db/entities/entities.db.server";
import { Params } from "react-router";
import { getUserRoles } from "../db/permissions/userRoles.db.server";
// import { getMyGroups } from "../db/permissions/groups.db.server";
import { getAllRoles } from "../db/permissions/roles.db.server";
import { DefaultAppRoles } from "~/application/dtos/shared/DefaultAppRoles";
import { AppOrAdminData } from "./useAppOrAdminData";
import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";

export type AppLoaderData = AppOrAdminData & {
  
  // currentTenant: TenantWithDetails;
  // mySubscription: TenantSubscriptionWithDetails | null;
  currentRole: UserType;
  // pendingInvitations: number;
};

export function useAppData(): AppLoaderData {  
  return (useMatches().find((f) => "routes/app")?.data ?? {}) as AppLoaderData;  
}

export async function loadAppData(request: Request, params: Params) {  
  const userInfo = await getUserInfo(request);

  if (UrlUtils.stripTrailingSlash(new URL(request.url).pathname) === UrlUtils.stripTrailingSlash(UrlUtils.currentTenantUrl(params))) {
    throw redirect(UrlUtils.currentTenantUrl(params, "dashboard"));
  }
  const user = await getUser(userInfo?.userId);
  
  const redirectTo = new URL(request.url).pathname;
  if (!userInfo || !user) {
    let searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  /*
  const currentTenant = await getTenant(tenantUrl.tenantId);
  if (!currentTenant) {
    throw redirect(`/app`);
  }
  */
  // const myTenants = await getMyTenants(user.id);
  // const tenantMembership = myTenants.find((f) => f.tenantId === tenantUrl.tenantId);

  let currentRole = UserType.MEMBER;
  if (user.admin) {
    currentRole = UserType.ADMIN;
  }
  // const pendingInvitations = await getLinkedAccountsCount(tenantUrl.tenantId, [LinkedAccountStatus.PENDING]);

  // const mySubscription = await getTenantSubscription(tenantUrl.tenantId);

  const roles = await getUserRoles(userInfo.userId ?? undefined);
  const allUserRoles = await getUserRoles(userInfo.userId ?? undefined);
  const permissions: string[] = [];
  roles.forEach((role) => {
    role.role.permissions.forEach((permission) => {
      if (!permissions.includes(permission.permission.name)) {
        permissions.push(permission.permission.name);
      }
    });
  });
  
  const data: AppLoaderData = {
    // i18n: translations,
    user,
    currentRole,
    allRoles: await getAllRoles("app"),
    roles,
    permissions,
    isSuperUser: roles.find((f) => f.role.name === DefaultAppRoles.SuperUser) !== undefined,
    isSuperAdmin: allUserRoles.find((f) => f.role.name === DefaultAdminRoles.SuperAdmin) !== undefined,
  };
  console.log('data', data);
  return data;
}
