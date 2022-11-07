import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/app/AppLayout";
import styles from "highlight.js/styles/night-owl.css";
import { Command } from "~/application/dtos/layout/Command";
import { getDocCommands } from "~/utils/services/docsService";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

type LoaderData = {
  title: string;
  commands: Command[];
};
export let loader: LoaderFunction = async ({ request }) => {

  const commands = await getDocCommands();

  const data: LoaderData = {
    title: `${"Docs"} | ${process.env.APP_NAME}`,

    commands,
  };
  return json(data);
};

export default function DocsRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <AppLayout layout="docs" commands={data.commands}>
      <div className="py-4 px-10 w-full col-span-2">
        <div className="prose prose-emerald">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
