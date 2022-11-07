import { UserProfileUpdatedDto } from "~/application/dtos/events/UserProfileUpdatedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import { createApplicationEvent } from ".";

export async function createUserProfileUpdatedEvent(tenantId: string, event: UserProfileUpdatedDto) {
  return await createApplicationEvent(ApplicationEvent.UserProfileUpdated, tenantId, event, [
    process.env.SERVER_URL + `/webhooks/events/users/profile-updated`,
  ]);
}
