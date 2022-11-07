import { UserSubscription, SubscriptionPrice, SubscriptionProduct, SubscriptionFeature } from "@prisma/client";
import { db } from "../db.server";

export type UserSubscriptionWithDetails = UserSubscription & {
  subscriptionPrice:
    | (SubscriptionPrice & {
        subscriptionProduct: SubscriptionProduct & { features: SubscriptionFeature[] };
      })
    | null;
};

export async function updateStripeCustomerId(userId: string, customerId?: string) {
  const user = await db.user.update({
    where: { id : userId },
    data : {
      stripeCustomerId: customerId
    }
  });
  return user;
}


export async function checkSubscription(userId: string, learnPostId: string) {
  const subscription = await db.userSubscription.findFirst({
    where: {
      AND: [ 
        { userId },
        { learnPostId }
      ]
    }
  });
  return subscription;
}



/*
export async function getOrPersistUserSubscription(userId: string) {
  const subscription = await db.userSubscription.findUnique({
    where: {
      userId,
      
    },
  });

  if (!subscription) {
    return await createUserSubscription(userId, "", 0);
  }
  return subscription;
}
*/

/*
export async function getUserSubscription(userId: string): Promise<UserSubscriptionWithDetails | null> {
  return await db.userSubscription.findUnique({
    where: {
      userId,
    },
    include: {
      subscriptionPrice: {
        include: {
          subscriptionProduct: {
            include: {
              features: true,
            },
          },
        },
      },
    },
  });
}
*/
/*


export async function updateUserSubscriptionCustomerId(userId: string, data: { stripeCustomerId: string }) {
  return await db.userSubscription.update({
    where: {
      userId,
    },
    data,
  });
}
*/


export async function createUserSubscription(
    userId: string, 
    learnPostId: string, 
    stripeSubscriptionId: string, 
    subscriptionPriceId: string, 
    quantity: number
  ) {
  return await db.userSubscription.create({ 
    data:{
      userId,
      learnPostId,
      stripeSubscriptionId,
      subscriptionPriceId,
      quantity
    }
  })
}

