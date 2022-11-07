import { EmailTemplate } from "~/application/dtos/email/EmailTemplate";
import emailTemplates from "~/application/emails/emailTemplates.server";
import UrlUtils from "../app/UrlUtils";
import { db } from "../db.server";
import { getUser } from "../db/users.db.server";
import { createPostmarkTemplate, deletePostmarkTemplate, getPostmarkTemplates } from "../email.server";


export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const items: EmailTemplate[] = [];
  try {
    const items = await emailTemplates();
    const templates = await getPostmarkTemplates();

    items.forEach((item) => {
      const template = templates.find((f) => f.alias === item.alias);
      if (template) {
        item.associatedServerId = template.associatedServerId;
        item.active = template.active;
        item.templateId = template.templateId;
      }
    });
    return items;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[ERROR at getEmailTemplates]: " + e);
  }
  return items;
}

export async function createEmailTemplates(templates: EmailTemplate[], alias?: string) {
  const layoutTemplate = templates.find((f) => f.type === "layout");
  if (layoutTemplate && layoutTemplate.associatedServerId <= 0) {
    await createPostmarkTemplate(layoutTemplate);
  }
  if (alias) {
    const template = templates.find((f) => f.alias === alias);
    if (template) {
      await createPostmarkTemplate(template, layoutTemplate?.alias);
      await new Promise((res) => setTimeout(res, 100));
    }
  } else {
    return await Promise.all(
      templates
        .filter((f) => f.type === "standard")
        .map(async (item) => {
          // eslint-disable-next-line no-console
          console.log("Creating email with alias: " + item.alias);
          await createPostmarkTemplate(item, layoutTemplate?.alias);
          await new Promise((res) => setTimeout(res, 1));
        })
    );
  }
}

export async function deleteEmailTemplate(alias: string) {
  return await deletePostmarkTemplate(alias);
}






export async function getAvailableInboundAddress(name: string) {
  const slug = "promaxcoq"
  const slugWithDots = slug.split("-").join(".");
  let address = slugWithDots;
  let tries = 1;
  do {
    const existingAddress = await db.inboundAddress.findUnique({
      where: {
        address,
      },
    });
    if (existingAddress !== null) {
      address = slugWithDots + tries.toString();
      tries++;
    } else {
      break;
    }
  } while (true);
  return address;
}


