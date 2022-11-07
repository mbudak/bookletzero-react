import { Permission, Role, RolePermission, UserRole } from "@prisma/client";
import { db } from "../../db.server";

export type UserRoleWithPermission = UserRole & {
  role: Role & { permissions: (RolePermission & { permission: Permission })[] };
};

export async function getUserRole(userId: string, roleId: string) {
  return await db.userRole.findFirst({
    where: {
      userId,
      roleId,
    },
  });
}

export async function getUserRoles(userId: string): Promise<UserRoleWithPermission[]> {
  return await db.userRole.findMany({
    where: {
      userId,
    },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
    orderBy: {
      role: {
        order: "asc",
      },
    },
  });
}

export async function createUserRole(userId: string, roleId: string) {
  return await db.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
}

export async function deleteUserRole(userId: string, roleId: string) {
  return await db.userRole.deleteMany({
    where: {
      userId,
      roleId,
    },
  });
}
