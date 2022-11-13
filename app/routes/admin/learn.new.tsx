import { LearnAuthor, LearnCategory, LearnTag } from "@prisma/client";
import { marked } from "marked";
import { useTranslation } from "react-i18next";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PostForm from "~/components/learn/PostForm";
import Breadcrumb from "~/components/ui/breadcrumbs/Breadcrumb";

import { LearnPostWithDetails, createLearnPost, getAllAuthors, getAllCategories, getAllTags } from "~/utils/db/learn.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/PermissionsHelper";

type LoaderData = {
  authors: LearnAuthor[];
  categories: LearnCategory[];
  tags: LearnTag[];
};

export let loader: LoaderFunction = async ({ request }) => {
  //. await verifyUserHasPermission(request, "admin.learn.create");
  const data: LoaderData = {
    authors: await getAllAuthors(),
    categories: await getAllCategories(),
    tags: await getAllTags(),
  };
  return json(data);
};

export type LearnPostActionData = {
  error?: string;
  preview?: {
    content: string;
    markdown: string;
  };
  createdPost?: LearnPostWithDetails | null;
};
const badRequest = (data: LearnPostActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {
  
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const content = form.get("content")?.toString() ?? "";
  if (action === "preview") {
    const data: LearnPostActionData = {
      preview: {
        content,
        markdown: marked(content),
      },
    };
    return json(data);
  } else if (action === "create") {
    const title = form.get("title")?.toString() ?? "";
    const slug = form.get("slug")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const date = form.get("date")?.toString() ?? "";
    const image = form.get("image")?.toString() ?? "";
    const markdown = marked(content);
    const published = Boolean(form.get("published"));
    
    const authorId = form.get("author")?.toString() ?? "";
    const categoryId = form.get("category")?.toString() ?? "";
    const tags = form.get("tags")?.toString() ?? "";

    try {
      const post = await createLearnPost({
        slug,
        title,
        description,
        date: new Date(date),
        image,
        content: markdown,
        totalQuestions: 0,
        published,
        authorId,
        categoryId,
        tagNames: tags.split(",").filter((f) => f.trim() != ""),
      });

      if (post) {
        return redirect("/learn/" + slug);
      } else {
        return badRequest({ error: "Could not create post" });
      }
    } catch (e) {
      return badRequest({ error: JSON.stringify(e) });
    }
  } else {
    return badRequest({ error: "Invalid Form" });
  }
};

export default function NewLearn() {
  
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <Breadcrumb
        className="w-full"
        home="/admin/dashboard"
        menu={[
          { title: "Learn", routePath: "/admin/learn" },
          { title: "New Learn", routePath: "/admin/learn/new" },
        ]}
      />
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">New Learn</h1>
        </div>
      </div>
      <div className="py-6 space-y-2 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostForm authors={data.authors} categories={data.categories} tags={data.tags} />
      </div>
    </div>
  );
}
