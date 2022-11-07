import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import clsx from "~/utils/shared/ClassesUtils";
import { useOuterClick } from "~/utils/shared/KeypressUtils";
import { useParams, useSubmit } from "@remix-run/react";
import UserUtils from "~/utils/app/UserUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppData } from "~/utils/data/useAppData";


interface Props {
  layout: "account" | "app" | "admin" | "home" | "docs";
}

export default function ProfileButton({ layout }: Props) {
  const params = useParams();
  const data = useAppData();
  
  const submit = useSubmit();

  const [opened, setOpened] = useState(false);

  function closeDropdownUser() {
    setOpened(false);
  }
  function signOut() {
    submit(null, { method: "post", action: "/logout" });
  }

  const clickOutside = useOuterClick(() => setOpened(false));

  return (
    <div ref={clickOutside} className="relative">
      <div className="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
        <button
          onClick={() => setOpened(!opened)}
          className={clsx(
            "bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-theme-100 focus:ring-offset-2 focus:ring-offset-theme-50 focus:text-theme-900 focus:z-10 font-medium hover:text-theme-800 inline-flex items-center relative rounded-full shadow-inner text-slate-400",
            !data.user?.avatar && "p-2 focus:bg-theme-400 hover:bg-theme-300",
            data.user?.avatar && "p-1 hover:bg-gray-200"
          )}
          id="user-menu"
          aria-label="User menu"
          aria-haspopup="true"
        >
          {(() => {
            if (data.user?.avatar) {
              return <img className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-800" src={data.user.avatar} alt="Avatar" />;
            } else {
              return (
                <span className="inline-block h-5 w-5 rounded-full overflow-hidden">
                  <svg className="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              );
            }
          })()}
        </button>
      </div>

      <Transition
        as={Fragment}
        show={opened}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="z-40 origin-top-right absolute right-0 mt-2 w-64 rounded-sm shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 rounded-sm bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
            <div className="truncate group flex items-center px-4 py-2 text-sm text-gray-700 transition ease-in-out duration-150" role="menuitem">
              <div className="flex flex-col space-y-1 truncate">
                <div className="font-medium">{UserUtils.profileName(data.user)}</div>
                <div className="font-bold truncate">{data.user?.email}</div>
              </div>
            </div>
            <div className="border-t border-gray-200"></div>

            {layout === "account" ? (
              <>
                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, `settings/profile`)}
                >
                  Profile
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, "settings/members")}
                >
                  Members
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, "settings/roles")}
                >
                  Roles
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, "settings/groups")}
                >
                  Groups
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, `settings/subscription`)}
                >
                  Supscriptions
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, "settings/account")}
                >
                  Account
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, `settings/linked-accounts`)}
                >
                  Linked Accounts
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, `settings/api`)}
                >
                  Api Keys
                </Link>

                <Link
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                  role="menuitem"
                  onClick={closeDropdownUser}
                  to={UrlUtils.currentTenantUrl(params, "settings/audit-trails")}
                >
                  Logs
                </Link>

                <div className="border-t border-gray-200 mt-1"></div>
              </>
            ) : (
              <Link
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                role="menuitem"
                onClick={closeDropdownUser}
                to={`/admin/profile`}
              >
                Profile
              </Link>
            )}

            <button
              onClick={signOut}
              className="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150 focus:outline-none"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
