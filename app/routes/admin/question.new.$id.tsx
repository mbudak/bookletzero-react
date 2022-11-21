// import { BlogAuthor, BlogCategory, BlogTag } from "@prisma/client";
import { marked } from "marked";
import { useTranslation } from "react-i18next";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import PostForm from "~/components/blog/PostForm";
import Breadcrumb from "~/components/ui/breadcrumbs/Breadcrumb";

// import { BlogPostWithDetails, createBlogPost, getAllAuthors, getAllCategories, getAllTags } from "~/utils/db/blog.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { QuestionWithDetails } from "~/utils/db/questions.db.server";
import QuestionForm from "~/components/question/QuestionForm";

type LoaderData = {
  questionClassId: number,
  // authors: BlogAuthor[];
  // categories: BlogCategory[];
  // tags: BlogTag[];
};
export let loader: LoaderFunction = async ({ request, params }) => {

  // await verifyUserHasPermission(request, "admin.blog.create");
  const data: LoaderData = {
    questionClassId: Number(params.id),
    // authors: await getAllAuthors(),
    // categories: await getAllCategories(),
    // tags: await getAllTags(),
  };
  return json(data);
};

export type QuestionActionData = {
  error?: string;
  preview?: {
    content: string;
    markdown: string;
  };
  createdQuestion?: QuestionWithDetails | null;
};
const badRequest = (data: QuestionActionData) => json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {
  
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const content = form.get("content")?.toString() ?? "";
  if (action === "preview") {
    const data: QuestionActionData = {
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
    const readingTime = form.get("reading-time")?.toString() ?? "";
    const authorId = form.get("author")?.toString() ?? "";
    const categoryId = form.get("category")?.toString() ?? "";
    const tags = form.get("tags")?.toString() ?? "";

    try {
      /*const post = await createBlogPost({
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

      if (post) {
        return redirect("/blog/" + slug);
      } else {
        return badRequest({ error: "Could not create post" });
      }
      */
      return redirect("/question/" + "idhere");
    } catch (e) {
      return badRequest({ error: JSON.stringify(e) });
    }
  } else {
    return badRequest({ error: "Form error" });
  }
};

export default function NewBlog() {
  
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <Breadcrumb
        className="w-full"
        home="/admin/dashboard"
        menu={[
          { title: "Question", routePath: "/admin/questions/0" },
          { title: "New", routePath: "/admin/question/new" },
        ]}
      />
      <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h1 className="flex-1 font-bold flex items-center truncate">New Question</h1>
        </div>
      </div>
      <div className="py-6 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
        {/* <PostForm authors={data.authors} categories={data.categories} tags={data.tags} />*/}
        <QuestionForm questionClassId={data.questionClassId}/>
      </div>
    </div>
  );
}
