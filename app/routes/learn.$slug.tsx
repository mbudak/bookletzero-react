import Footer from "~/components/front/Footer";
import Header from "~/components/front/Header";
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { marked } from "marked";
import DateUtils from "~/utils/shared/DateUtils";
import { LearnPostWithDetails, getLearnPost, updateLearnPostPublished } from "~/utils/db/learn.db.server";
import { getUserInfo } from "~/utils/session.server";
import { getUser } from "~/utils/db/users.db.server";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { useEffect, useRef, useState } from "react";
import PostTags from "~/components/learn/PostTags";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { SubscriptionPriceDto } from "~/application/dtos/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import { UserSubscriptionWithDetails, checkSubscription, updateStripeCustomerId, createUserSubscription } from "~/utils/db/userSubscriptions.db.server";
import { getSubscriptionPrice, getSubscriptionPriceByStripeId, getSubscriptionProduct } from "~/utils/db/subscriptionProducts.db.server";
import clsx from "~/utils/shared/ClassesUtils";
import { createStripeCustomer, createStripeSession, getStripeSession, getStripeSubscription } from "~/utils/stripe.server";
import { LearnPost, SubscriptionPrice } from "@prisma/client";

import { createSubscriptionSubscribedEvent } from "~/utils/services/events/subscriptionsEventsService";

interface Props {
  current: UserSubscriptionWithDetails | null;
  // price: Awaited<ReturnType<typeof getSubscriptionProduct>>;
  billingPeriod: SubscriptionBillingPeriod;
  currency: string;
  canSubscribe: boolean;
  userSubscribed: boolean;
}

type LoaderData = {
  title: string;
  meta: any;
  post: LearnPostWithDetails;
  markdown: string;
  canEdit: boolean;
  userSubscribed: boolean;
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const userInfo = await getUserInfo(request);
  var isUserSubscribed = false;
  const user = await getUser(userInfo.userId);  
  const post = await getLearnPost(params.slug ?? "");
  
  if (user) {

    //     console.log(userInfo.userId, post?.prices[0].stripeId ?? "");
    // Make sure user connected to Stripe
    if (!user.stripeCustomerId) {
      const stripeCustomer = await createStripeCustomer(user?.email, user?.firstName + " " + user?.lastName);
      const customer = await updateStripeCustomerId(user.id, stripeCustomer?.id);      
    } else {

    }

    const check = await checkSubscription(userInfo.userId, post?.id as string);
    if (check) {
      isUserSubscribed = true;
    }
    

  } else {
    console.log('user not found');
  }

  

  if (!post) {
    return redirect("/404");
  }

  if (!post.published && (!user || !user.admin)) {
    return redirect("/404");
  }

  const url = new URL(request.url);
  const session_id = url.searchParams.get("session_id");
  if (session_id) {
    try {
      const session = await getStripeSession(session_id);
      if (session.subscription) {
        const stripeSubscription = await getStripeSubscription(session.subscription.toString());
        let price: (SubscriptionPrice & { subscriptionProduct: LearnPost }) | null = null;
        let quantity: number = 0;
        if (stripeSubscription && stripeSubscription?.items.data.length > 0) {
          const data = stripeSubscription?.items.data[0];
          price = await getSubscriptionPriceByStripeId(data.plan.id);
          if (data.quantity) {
            quantity = data.quantity;
          }
          
          // console.log({ session: JSON.stringify(session) });
          /*await updateUserStripeSubscriptionId(
            userInfo.userId,
            {
          
              subscriptionPriceId: price?.id ?? "",
              stripeSubscriptionId: session.subscription.toString(),
              quantity,
          });
          */
         const res = await createUserSubscription(userInfo.userId, post.id, session.subscription.toString(), price?.id as string, 1);
         
          
          // await createLog(request, tenantUrl, "Subscribed", t(price?.subscriptionProduct.title ?? ""));
          return redirect(`/account/settings/subscription`);

        }

      }
    } catch (e) { }
  }

  const data: LoaderData = {
    title: `${post.title} | ${"Learn"} | ${process.env.APP_NAME}`, // Optional
    userSubscribed: isUserSubscribed,
    post,
    markdown: marked(post.content),
    canEdit: user?.admin !== undefined,
    meta: {
      "twitter:image": post.image,
      "twitter:card": "summary_large_image",
      "twitter:creator": "@" + process.env.SOCIAL_TWITTER_CREATOR,
      "twitter:site": "@" + process.env.SOCIAL_TWITTER,
      "twitter:title": post.title,
      "twitter:description": post.description,
    },
  };
  
  return json(data);
};

export type LearnPostActionData = {
  error?: string;
  createdPost?: LearnPostWithDetails | null;
};

type ActionData = {
  error?: string;
  success?: string;
};

const badRequest = (data: LearnPostActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request, params }) => {
  const userInfo = await getUserInfo(request);
  
  const user = await getUser(userInfo.userId);

  const form = await request.formData();
  const action = form.get("action")?.toString();
  const priceId = form.get("price-id")?.toString();
  
  const price = await getSubscriptionPrice(priceId || "");
  


  if (action === "subscribe" && price && user) {
    const stripeCustomerId = user.stripeCustomerId as string;
    const session = await createStripeSession(request, stripeCustomerId, price?.stripeId, 1);
    
      if (!session || !session.url) {
        return badRequest({
          error: "Could not update subscription",
        });
      }
      return redirect(session.url);
    } else if (action === "cancel") {
      /*if (!userSubscription?.stripeSubscriptionId) {
        return badRequest({
          error: "Not subscribed",
        });
      }
      */
      const actionData: ActionData = {
        success: "Successfully cancelled",
      };

      return json(actionData);
    }
};

export const meta: MetaFunction = ({ data }) => {
  const { post } = data as LoaderData;

  return {
    title: data.title,
    description: post.description,
    "og:image": post.image,
    keywords: post.tags.map((postTag) => postTag.tag.name).join(","),
    ...data.meta,
  };
};




export default function LearnPostRoute({ current, billingPeriod, currency, canSubscribe }: Props) {

  const { post, markdown, canEdit, userSubscribed } = useLoaderData<LoaderData>();
  
  const transition = useTransition();
  const loading = transition.state === "submitting";
  const submit = useSubmit();


  function selectPrice() {
    const form = new FormData();
    form.set("action", "subscribe");
    form.set("price-id", post.prices[0].stripeId);

    submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <Header />

      <div className="container p-2 mx-auto">
        <div className="flex flex-row flex-wrap py-4">

          <main role="main" className="w-full sm:w-2/3 md:w-3/4 pt-1 px-2">

            <div className="sticky top-0 bg-white">
              <span className=" flex items-center space-x-1 text-base text-center tracking-wide justify-center text-gray-500">
                <span>[</span>
                <span className="text-indigo-600 font-semibold uppercase">{post.category.name}</span>
                <span>]</span>
                {/* <span className=" text-gray-500">{DateUtils.dateMonthDayYear(post.date)}</span>*/}
              </span>
              <h1 className=" mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {post.title}
              </h1>
            </div>



            <div className="mt-6 prose dark:prose-dark prose-indigo prose-lg mx-auto space-y-6 max-w-2xl">

              <div dangerouslySetInnerHTML={{ __html: markdown }} />
            </div>


          </main>
          <aside className="w-full sm:w-1/3 md:w-1/4 px-2">
            <div className="sticky top-0 p-4 bg-white rounded-xl w-full">
              {post.image && <img className="object-cover h-48 border border-gray-300 dark:border-gray-800 rounded-lg shadow-lg" src={post.image} alt={post.title} />}
              <ul className="nav flex flex-col overflow-hidden">
                <li className="nav-item py-4 text-center">
                  <span className="font-sans text-2xl not-italic font-semibold text-left p-2 bg-white text-gray-900">${post.prices[0]?.price}</span>
                  <span className="font-sans text-2x not-italic font-semi text-left p-2 bg-white text-gray-600">for {post.prices[0]?.billingPeriod} days</span>
                  {/* <span className="font-sans text-xl not-italic text-left p-2 bg-white text-gray-500 line-through">$230</span> */}
                  <div className="nav-item text-center text-sm text-gray-500">
                    {/* * 3 months plan */}
                  </div>
                </li>

                <li className="nav-item">
                  {userSubscribed && (
                    <Link
                    to="/account/settings/subscription"
                    className="bg-amber-400 hover:bg-amber-300 inline-flex items-center justify-center w-full px-4 py-2 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
                  >
                    Details
                  </Link>

                  
                  )}

                  {!userSubscribed &&  (
                  <button
                    // disabled={loading || isCurrent(plan) || !getPrice(plan)?.stripeId || !canSubscribe}
                    type="button"
                    onClick={() => selectPrice()}
                    className={clsx(
                      "bg-amber-400 hover:bg-amber-300 inline-flex items-center justify-center w-full px-4 py-2 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm",
                      // loading || isCurrent(post) 
                      //   ? "opacity-80 cursor-not-allowed"
                      //   : "hover:bg-gray-100 border-slate-800"
                    )}
                  >
                    Subscribe
                  </button>
                  )}

                </li>



              </ul>
            </div>
          </aside>
        </div>
      </div>




      <Footer />
    </div>
  );
}
