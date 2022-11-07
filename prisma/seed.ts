import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UserType } from "~/application/enums/UserType";
import { seedLearn } from "./seedLearn";

// import { seedSampleEntities } from "./seedSampleEntities";

// import { LinkedAccountStatus } from "~/application/enums/tenants/LinkedAccountStatus";
// import { seedRolesAndPermissions } from "./seedRolesAndPermissions";


const db = new PrismaClient();

async function seed() {
  await seedLearn();

  const adminEmail = process.env.ADMIN_EMAIL?.toString();
  const adminPassword = process.env.ADMIN_PASSWORD?.toString();
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }
  const admin = await createUser("AdminPro", "UserMaxCoq", adminEmail, adminPassword, UserType.ADMIN);
  
  // await createUser("Demo", "Admin", "guest@admin.com", "password");
  // const user1 = await createUser("John", "Doe", "john.doe@company.com", "password");
  // const user2 = await createUser("Luna", "Davis", "luna.davis@company.com", "password");

  // User without tenants
  // await createUser("Alex", "Martinez", "alex.martinez@company.com", "password");

  // const tenant1 = await createTenant("Acme Corp 1", [
  //  { ...admin, type: TenantUserType.ADMIN },
  //  { ...user1, type: TenantUserType.ADMIN },
  //  { ...user2, type: TenantUserType.MEMBER },
  // ]);
  
  // const tenant2 = await createTenant("Acme Corp 2", [
  //  { ...user1, type: TenantUserType.OWNER },
  //  { ...user2, type: TenantUserType.MEMBER },
  // ]);

  // const tenant1And2Relationship = await createLinkedAccount({
  //  createdByUserId: user1.id,
  //  createdByTenantId: tenant1.id,
  //  providerTenantId: tenant1.id,
  //  clientTenantId: tenant2.id,
  //  status: LinkedAccountStatus.LINKED,
  // });

  // Sample Entities
  // TODO: Remove this line when you have understood how to seed entities
  // await seedSampleEntities(tenant1And2Relationship, user1);

  await seedCoreEntities();

  // Permissions
  // await seedRolesAndPermissions();
}

async function seedCoreEntities() {
  // Admin Entities
  // await seedCrm();

  // App Entities
  // TODO: Seed your entities
}

async function createUser(firstName: string, lastName: string, email: string, password: string, adminRole?: UserType) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email,
      passwordHash,
      avatar: "",
      firstName,
      lastName,
      phone: ""
    },
  });
  if (adminRole !== undefined) {
    await db.adminUser.create({
      data: {
        userId: user.id,
        role: adminRole,
      },
    });
  }
  return user;
}



seed();