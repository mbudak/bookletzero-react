import { Event } from "@prisma/client";
import { createEvent } from "~/utils/db/events/events.db.server";
import { createEventWebhookAttempt } from "~/utils/db/events/eventWebhookAttempts.db.server";

export async function createApplicationEvent(name: string, tenantId: string, data: any, endpoints?: string[]) {
  const event = await createEvent({
    name,
    tenantId,
    data: JSON.stringify(data),
  });

  endpoints?.forEach((endpoint) => {
    callEventEndpoint(event, endpoint, JSON.stringify(data));
  });

  return event;
}

async function callEventEndpoint(event: Event, endpoint: string, body: string) {
  const webhookAttempt = await createEventWebhookAttempt({ eventId: event.id, endpoint });
  fetch(process.env.SERVER_URL + `/api/events/webhooks/attempts/${webhookAttempt.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}
