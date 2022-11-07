// import { i18nHelper } from "~/locale/i18n.utils";
import UserUtils from "../app/UserUtils";
import { getAppConfiguration } from "../db/appConfiguration.db.server";
import { getAllRoles } from "../db/permissions/roles.db.server";
// import { createTenant, createTenantUser } from "../db/tenants.db.server";
import { getUserByEmail, register } from "../db/users.db.server";
import { sendEmail } from "../email.server";
import { createStripeCustomer } from "../stripe.server";
import crypto from "crypto";
import { createRegistration, getRegistrationByEmail, updateRegistration } from "../db/registration.db.server";
import { getClientIPAddress } from "remix-utils";


export async function validateRegistrationForm(request: Request, checkEmailVerification: boolean = true) {
  
  const { auth } = await getAppConfiguration();

  const formData = await request.formData();
  const email = formData.get("email")?.toString().toLowerCase().trim();
  const password = formData.get("password")?.toString();

  // const firstName = formData.get("first-name")?.toString();
  // const lastName = formData.get("last-name")?.toString();
  
  
  if (!email || !UserUtils.validateEmail(email)) {
    throw Error("Invalid email format");
  } else if (!auth.requireEmailVerification && !UserUtils.validatePassword(password)) {
    throw Error("Password required");
  }
  
  const ipAddress = getClientIPAddress(request.headers)?.toString() ?? "";
  // eslint-disable-next-line no-console
  console.log("[REGISTRATION ATTEMPT]", { email, domain: email.substring(email.lastIndexOf("@") + 1), ipAddress });

  
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw Error("email address already registered");
  }
  
  const form = { email, password, ipAddress };
  if (checkEmailVerification && auth.requireEmailVerification) {
    return { form, verificationRequired: true };
  }

  const registered = await createUser({ email, password });
  return { form, verificationRequired: false, registered };
  
}

interface CreateRegistrationFormDto {
  email: string;
  ipAddress: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  recreateToken?: boolean;
}
export async function createRegistrationForm({ email, company, firstName, lastName, ipAddress, recreateToken }: CreateRegistrationFormDto) {
  const registration = await getRegistrationByEmail(email);
  if (registration) {
    if (registration.createdTenantId) {
      throw Error("api.errors.userAlreadyRegistered");
    } else {
      if (recreateToken) {
        const newToken = crypto.randomBytes(20).toString("hex");
        await updateRegistration(registration.id, {
          firstName,
          lastName,
          company,
          token: newToken,
        });
        await sendEmail(email, "email-verification", {
          action_url: process.env.SERVER_URL + `/verify/` + newToken,
          email: email,
          first_name: firstName ?? "",
          last_name: lastName ?? "",
          company,
        });
      }
    }
  } else {
    var token = crypto.randomBytes(20).toString("hex");
    await createRegistration({
      email,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      company: company ?? "",
      token,
      selectedSubscriptionPriceId: null,
      ipAddress,
    });
    await sendEmail(email, "email-verification", {
      action_url: process.env.SERVER_URL + `/verify/` + token,
      first_name: firstName,
      last_name: lastName,
      email,
      company,
    });
  }
}

interface CreateUserAndTenantDto {
  email: string;
  password?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
}
export async function createUser({ email, password, company, firstName, lastName }: CreateUserAndTenantDto) {
  const stripeCustomer = await createStripeCustomer(email, "booklet-zero");
  if (!stripeCustomer) {
    throw Error("Could not create Stripe customer");
  }
  const user = await register(email, password ?? "", firstName ?? "", lastName ?? "");
  if (!user) {
    throw Error("Could not create user");
  }


  await sendEmail(email, "welcome", {
    action_url: process.env.SERVER_URL + `/login`,
    name: firstName,
  });

  

  return { user };
}
