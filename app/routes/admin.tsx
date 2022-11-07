import { useCatch } from "@remix-run/react";
import { useEffect } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";
import AppLayout from "~/components/app/AppLayout";
import UrlUtils from "~/utils/app/UrlUtils";
import { loadAdminData } from "~/utils/data/useAdminData";
import { useRootData } from "~/utils/data/useRootData";

export let loader: LoaderFunction = async ({ request }) => {
  const data = await loadAdminData(request);
  return json(data);
};

export default function AdminRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (UrlUtils.stripTrailingSlash(location.pathname) === "/admin") {
      navigate("/admin/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  return (
    <AppLayout layout="admin">
      <Outlet />
    </AppLayout>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  const data = useRootData();
  return (
    <div className="mx-auto p-12 text-center">
      <h1>
        Server error,{" "}
        <button type="button" onClick={() => window.location.reload()} className="underline">
          please try again
        </button>
        {data.debug && (
          <div className="flex flex-col space-y-1 text-left">
            <div>
              <span className="font-bold">Message:</span> {error.message}
            </div>
            <div>
              <span className="font-bold">Stack:</span> {error.stack}
            </div>
          </div>
        )}
      </h1>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return <div>/Admin Client Error: {caught.status}</div>;
}
