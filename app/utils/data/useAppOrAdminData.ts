import { useMatches } from "@remix-run/react";
// import { MyTenant } from "../db/tenants.db.server";
import { UserWithoutPassword } from "../db/users.db.server";
import { Role } from "@prisma/client";
import { UserRoleWithPermission } from "../db/permissions/userRoles.db.server";
import { AppLoaderData } from "./useAppData";
// import { AdminLoaderData } from "./useAdminData";
// import { Language } from "remix-i18next";
// import { EntityWithDetails } from "../db/entities/entities.db.server";
// import { GroupWithDetails } from "../db/permissions/groups.db.server";

export type AppOrAdminData = {
  // i18n: Record<string, Language>;
  user: UserWithoutPassword;
  // myTenants: MyTenant[];
  allRoles: Role[];
  roles: UserRoleWithPermission[];
  permissions: string[];
  // entities: EntityWithDetails[];
  isSuperUser: boolean;
  isSuperAdmin: boolean;
  // myGroups: GroupWithDetails[];
};

export function useAppOrAdminData(): AppOrAdminData {  
  const appData = (useMatches().find((f) => "routes/app")?.data ?? {}) as AppLoaderData;
  
  return appData;
}
