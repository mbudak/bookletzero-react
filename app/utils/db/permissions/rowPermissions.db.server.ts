import { db } from "~/utils/db.server";

export async function getRowPermissions(rowId: string) {
  return await db.rowPermission.findMany({
    where: {
      rowId,
    },
  });
}

export async function getRowPermissionByTenant(rowId: string, tenantId?: string | null) {
  return await db.rowPermission.findFirst({
    where: {
      rowId,
      tenantId,
    },
  });
}

export async function getRowPermissionByGroups(rowId: string, groups: string[]) {
  return await db.rowPermission.findFirst({
    where: {
      rowId,
      groupId: {
        in: groups,
      },
    },
  });
}

export async function getRowPermissionByRoles(rowId: string, roles: string[]) {
  return await db.rowPermission.findFirst({
    where: {
      rowId,
      roleId: {
        in: roles,
      },
    },
  });
}

export async function getRowPermissionByUsers(rowId: string, users: string[]) {
  return await db.rowPermission.findFirst({
    where: {
      rowId,
      userId: {
        in: users,
      },
    },
  });
}

export async function createRowPermission(data: { rowId: string; tenantId?: string | null; roleId?: string; groupId?: string; userId?: string }) {
  return await db.rowPermission.create({
    data,
  });
}

export async function deleteRowPermission(rowId: string) {
  return await db.rowPermission.deleteMany({
    where: {
      rowId,
    },
  });
}
