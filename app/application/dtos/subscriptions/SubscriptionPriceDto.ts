import { SubscriptionProductDto } from "./SubscriptionProductDto";
import { SubscriptionPriceType } from "~/application/enums/subscriptions/SubscriptionPriceType";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { User, UserSubscription } from ".prisma/client";

export interface SubscriptionPriceDto {
  id?: string;
  stripeId: string;
  type: SubscriptionPriceType;
  billingPeriod: SubscriptionBillingPeriod;
  price: number;
  currency: string;
  trialDays: number;
  active: boolean;
  priceBefore?: number;
  subscriptionProductId: string;
  subscriptionProduct?: SubscriptionProductDto;
  userSubscriptions?: (UserSubscription & { user: User })[];
}
