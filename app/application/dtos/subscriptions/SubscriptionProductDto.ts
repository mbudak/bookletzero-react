import { SubscriptionPriceDto } from "./SubscriptionPriceDto";
import { SubscriptionFeatureDto } from "./SubscriptionFeatureDto";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import { LearnPost } from "@prisma/client";

export interface SubscriptionProductDto {
  id?: string;  
  stripeId: string;
  learnPostId: string;
  order: number;
  title: string;
  active: boolean;
  model: PricingModel;
  public: boolean;
  description?: string;
  badge?: string;
  translatedTitle?: string;
  features: SubscriptionFeatureDto[];
  prices: SubscriptionPriceDto[];  
  learnPost: LearnPost[]
}
