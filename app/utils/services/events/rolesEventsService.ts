import { RoleAssignedDto } from "~/application/dtos/events/RoleAssignedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import { createApplicationEvent } from ".";

export async function createRoleAssignedEvent(tenantId: string, event: RoleAssignedDto) {
  return await createApplicationEvent(ApplicationEvent.RoleAssigned, tenantId, event, [process.env.SERVER_URL + `/webhooks/events/roles/assigned`]);
}
