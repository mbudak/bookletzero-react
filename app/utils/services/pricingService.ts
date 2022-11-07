import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";

export async function createPlan(
    plan: SubscriptionProductDto,
    prices: { billingPeriod: SubscriptionBillingPeriod, price: number, currency: string}[],
    features: SubscriptionFeatureDto[]
) {
    // Create stripe product
  const stripeProduct = await createStripeProduct({ title: plan.translatedTitle ?? plan.title });
  
}