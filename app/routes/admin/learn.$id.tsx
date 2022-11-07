import { LearnAuthor, LearnCategory, LearnTag } from "@prisma/client";
import { marked } from "marked";
import { useTranslation } from "react-i18next";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import PostForm from "~/components/learn/PostForm";
import Breadcrumb from "~/components/ui/breadcrumbs/Breadcrumb";
import { useAdminData } from "~/utils/data/useAdminData";
import { LearnPostWithDetails, deleteLearnPost, getAllAuthors, getAllCategories, getAllTags, getLearnPost, updateLearnPost } from "~/utils/db/learn.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/PermissionsHelper";

type LoaderData = {
  item: LearnPostWithDetails;
  authors: LearnAuthor[];
  categories: LearnCategory[];
  tags: LearnTag[];
};

export let loader: LoaderFunction = async ({ params }) => {
  const item = await getLearnPost(params.id ?? "");
  if (!item) {
    return redirect("/admin/learn");
  }

  const data: LoaderData = {
    item,
    authors: await getAllAuthors(),
    categories: await getAllCategories(),
    tags: await getAllTags(),
  };

  return json(data);
};

export type LearnPostActionData = {
  error?: string;
  createdPost?: LearnPostWithDetails | null;
};
const badRequest = (data: LearnPostActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const content = form.get("content")?.toString() ?? "";
  if (action === "edit") {
    //. await verifyUserHasPermission(request, "admin.learn.update");
    const title = form.get("title")?.toString() ?? "";
    const slug = form.get("slug")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const date = form.get("date")?.toString() ?? "";
    const image = form.get("image")?.toString() ?? "";
    const markdown = marked(content);
    const published = Boolean(form.get("published"));
    const readingTime = form.get("reading-time")?.toString() ?? "";
    const authorId = form.get("author")?.toString() ?? "";
    const categoryId = form.get("category")?.toString() ?? "";
    const tags = form.get("tags")?.toString() ?? "";

    try {
      await updateLearnPost(params.id ?? "", {
        slug,
        title,
        description,
        date: new Date(date),
        image,
        content: markdown,
        readingTime,
        published,
        authorId,
        categoryId,
        tagNames: tags.split(",").filter((f) => f.trim() != ""),
      });

      return redirect("/learn/" + slug);
    } catch (e) {
      return badRequest({ error: JSON.stringify(e) });
    }
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.learn.delete");
    try {
      await deleteLearnPost(params.id ?? "");
      return redirect("/admin/learn");
    } catch (e) {
      return badRequest({ error: JSON.stringify(e) });
    }
  } else {
    return badRequest({ error: "Invalid Form" });
  }
};

export default function NewLearn() {
  
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();
  return (
    <div>
      <Breadcrumb
        className="w-full"
        home="/admin/dashboard"
        menu={[
          { title: data.item.title, routePath: "/admin/learn" },
          { title: "Edit", routePath: "/admin/learn/" + params.id },
        ]}
      />
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">Edit</h1>
        </div>
      </div>
      <div className="py-6 space-y-2 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <PostForm
          item={data.item}
          authors={data.authors}
          categories={data.categories}
          tags={data.tags}
          canUpdate={adminData.permissions.includes("admin.learn.update")}
          canDelete={adminData.permissions.includes("admin.learn.delete")}
        />
      </div>
    </div>
  );
}
