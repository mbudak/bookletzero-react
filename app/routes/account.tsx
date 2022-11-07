import { Outlet, useCatch, useLocation, useNavigate } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import AppLayout from "~/components/app/AppLayout";
import { useRootData } from "~/utils/data/useRootData";
import { loadAccountData } from "~/utils/data/useAccountData";

export let loader: LoaderFunction = async ({ request }) => {
    const data = await loadAccountData(request);
    return json(data);
  };

  
export default function AccountRoute(){
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <AppLayout layout="account">
            <Outlet />
        </AppLayout>
    )
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
    return <div>/Account Client Error: {caught.status}</div>;
  }
  