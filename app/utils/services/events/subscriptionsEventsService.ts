import { SubscriptionCancelledDto } from "~/application/dtos/events/SubscriptionCancelledDto";
import { SubscriptionSubscribedDto } from "~/application/dtos/events/SubscriptionSubscribedDto";
import { ApplicationEvent } from "~/application/dtos/shared/ApplicationEvent";
import { createApplicationEvent } from ".";

export async function createSubscriptionSubscribedEvent(tenantId: string, event: SubscriptionSubscribedDto) {
  return await createApplicationEvent(ApplicationEvent.SubscriptionSubscribed, tenantId, event, [
    process.env.SERVER_URL + `/webhooks/events/subscriptions/subscribed`,
  ]);
}

export async function createSubscriptionCancelledEvent(tenantId: string, event: SubscriptionCancelledDto) {
  return await createApplicationEvent(ApplicationEvent.SubscriptionCancelled, tenantId, event, [
    process.env.SERVER_URL + `/webhooks/events/subscriptions/cancelled`,
  ]);
}
