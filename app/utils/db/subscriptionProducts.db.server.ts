import { SubscriptionFeature, SubscriptionPrice, SubscriptionProduct } from ".prisma/client";
import { SubscriptionFeatureDto } from "~/application/dtos/subscriptions/SubscriptionFeatureDto";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionPriceType } from "~/application/enums/subscriptions/SubscriptionPriceType";
import { db } from "~/utils/db.server";

export type SubscriptionPriceWithProduct = SubscriptionPrice & {
  subscriptionProduct: SubscriptionProduct;
};

export async function getAllSubscriptionProductsWithTenants(): Promise<SubscriptionProductDto[]> {
  return await db.subscriptionProduct
    .findMany({
      include: {
        prices: {
          include: {
            tenantSubscriptions: {
              include: {
                tenant: true,
              },
            },
          },
        },
        features: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })
    .catch(() => {
      return [];
    });
}

export async function getAllSubscriptionProducts(isPublic?: boolean): Promise<SubscriptionProductDto[]> {
  if (isPublic) {
    return await db.subscriptionProduct
      .findMany({
        where: {
          active: true,
          public: true,
        },
        include: {
          prices: true,
          features: {
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      })
      .catch(() => {
        return [];
      });
  }
  return await db.subscriptionProduct
    .findMany({
      where: {
        active: true,
      },
      include: {
        prices: true,
        features: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })
    .catch(() => {
      return [];
    });
}

export async function getAllSubscriptionFeatures(): Promise<SubscriptionFeature[]> {
  return await db.subscriptionFeature.findMany({});
}

export async function getSubscriptionProduct(id: string): Promise<any | null> {
  return await db.subscriptionProduct.findUnique({
    where: {
      id,
    },
    include: {
      prices: true,
      learnPost: true,
      features: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
}

export async function getSubscriptionPrices(): Promise<SubscriptionPriceWithProduct[]> {
  return await db.subscriptionPrice
    .findMany({
      include: {
        subscriptionProduct: true,
      },
      orderBy: [
        {
          subscriptionProduct: {
            order: "asc",
          },
        },
        {
          price: "asc",
        },
      ],
    })
    .catch(() => {
      return [];
    });
}

export async function getSubscriptionPrice(id: string): Promise<SubscriptionPriceWithProduct | null> {
  return await db.subscriptionPrice
    .findFirst({
      where: { stripeId: id },
      include: {
        subscriptionProduct: true,
      },
    })
    .catch(() => {
      return null;
    });
}

export async function getSubscriptionPriceByStripeId(stripeId: string): Promise<SubscriptionPriceWithProduct | null> {
  return await db.subscriptionPrice
    .findFirst({
      where: { stripeId },
      include: {
        subscriptionProduct: true,
      },
    })
    .catch(() => {
      return null;
    });
}

export async function createSubscriptionProduct(data: {
  stripeId: string;
  order: number;
  title: string;
  model: PricingModel;
  description: string;
  badge: string;
  active: boolean;
  public: boolean;
}): Promise<SubscriptionProduct> {
  return await db.subscriptionProduct.create({
    data,
  });
}

export async function updateSubscriptionProduct(
  id: string,
  data: {
    stripeId?: string;
    order: number;
    title: string;
    model: PricingModel;
    description: string;
    badge: string;
    public: boolean;
  }
): Promise<SubscriptionProduct> {
  return await db.subscriptionProduct.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateSubscriptionProductStripeId(id: string, data: { stripeId: string }) {
  return await db.subscriptionProduct.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateSubscriptionPriceStripeId(id: string, data: { stripeId: string }) {
  return await db.subscriptionPrice.update({
    where: {
      id,
    },
    data,
  });
}

export async function createSubscriptionPrice(data: {
  subscriptionProductId: string;
  stripeId: string;
  type: SubscriptionPriceType;
  billingPeriod: SubscriptionBillingPeriod;
  price: number;
  currency: string;
  trialDays: number;
  active: boolean;
}): Promise<SubscriptionPrice> {
  return await db.subscriptionPrice.create({ data });
}

export async function createSubscriptionFeature(subscriptionProductId: string, data: SubscriptionFeatureDto): Promise<SubscriptionFeature> {
  return await db.subscriptionFeature.create({
    data: {
      subscriptionProductId,
      ...data,
    },
  });
}

export async function updateSubscriptionFeature(id: string, data: SubscriptionFeatureDto): Promise<SubscriptionFeature> {
  return await db.subscriptionFeature.update({
    where: { id },
    data,
  });
}

export async function deleteSubscriptionProduct(id: string) {
  return await db.subscriptionProduct.delete({
    where: {
      id,
    },
  });
}

export async function deleteSubscriptionPrice(id: string) {
  return await db.subscriptionPrice.delete({
    where: {
      id,
    },
  });
}

export async function deleteSubscriptionFeatures(subscriptionProductId: string) {
  return await db.subscriptionFeature.deleteMany({
    where: {
      subscriptionProductId,
    },
  });
}
