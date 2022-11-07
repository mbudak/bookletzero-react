import { db } from "~/utils/db.server";

export async function createEventWebhookAttempt(data: { eventId: string; endpoint: string }) {
  return await db.eventWebhookAttempt.create({
    data,
  });
}
