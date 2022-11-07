import { Permission } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { AppOrAdminData } from "../data/useAppOrAdminData";
import { getPermissionByName } from "../db/permissions/permissions.db.server";
import { getUserRoles } from "../db/permissions/userRoles.db.server";
import { getUserInfo } from "../session.server";


export async function getUserPermission(request: Request, permissionName: string) {
  const permission = await getPermissionByName(permissionName);
  const userInfo = await getUserInfo(request);
  const userRoles = await getUserRoles(userInfo.userId ?? undefined);
  let userPermission: Permission | undefined = undefined;
  userRoles.forEach((userRole) => {
    userRole.role.permissions.forEach((rolePermission) => {
      if (rolePermission.permission.name === permissionName) {
        userPermission = rolePermission.permission;
      }
    });
  });
  return { permission, userPermission };
}

export async function verifyUserHasPermission(request: Request, permissionName: string) {
  const { permission, userPermission } = await getUserPermission(request, permissionName);
  if (permission && !userPermission) {    
      throw redirect(`/unauthorized/${permissionName}?redirect=${new URL(request.url).pathname}`);
  }
}

export function getUserHasPermission(appOrAdminData: AppOrAdminData, permission: string) {
  if (appOrAdminData.isSuperAdmin || appOrAdminData.isSuperUser) {
    return true;
  }
  return appOrAdminData.permissions.includes(permission);
}
