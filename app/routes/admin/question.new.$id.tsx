import { marked } from "marked";
import { ActionFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/server-runtime";
import { Form,  useActionData, useLoaderData, useTransition } from "@remix-run/react";

import Breadcrumb from "~/components/ui/breadcrumbs/Breadcrumb";
import { createQuestion, QuestionWithDetails } from "~/utils/db/questions.db.server";
import QuestionForm from "~/components/question/QuestionForm";

import { AdminLoaderData, loadAdminData } from "~/utils/data/useAdminData";

type LoaderData = {
  questionClassId: number,

};
export let loader: LoaderFunction = async ({ request, params }) => {
  const data: LoaderData = {
    questionClassId: Number(params.id),    
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

export const action: ActionFunction = async ({ request, params }) => {  
  
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
    
    const questionClassId = Number(params.id);
    const qBody = form.get("qBody")?.toString() ?? "";
    const qImageUrl = form.get("qImageUrl")?.toString() ?? "";
    const qDetails = form.get("qDetails")?.toString() ?? "";
    const qSummary = form.get("qSummary")?.toString() ?? "";
    const qExternalLink = form.get("qExternalLink")?.toString() ?? "";
    const qAccepted = false;
    
    
    try {
      
      const question = await createQuestion(
        "", // not grouped yet
        questionClassId,
        qBody,
        qImageUrl,
        qDetails,
        qSummary,
        qExternalLink,
        qAccepted // not accepted yet
      ).catch(err => {
        console.log('err', err)
      });
      console.log('question', question);

      if (question) {
        return redirect("/admin/question/" + question.id);
      } else {
        return badRequest({ error: "Could not create question"});
      }
            
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
