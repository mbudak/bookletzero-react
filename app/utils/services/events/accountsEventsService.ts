import { AccountCreatedDto } from "~/application/dtos/events/AccountCreatedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import { createApplicationEvent } from ".";

export async function createAccountCreatedEvent(tenantId: string, event: AccountCreatedDto) {
  return await createApplicationEvent(ApplicationEvent.AccountCreated, tenantId, event, [process.env.SERVER_URL + `/webhooks/events/accounts/created`]);
}
