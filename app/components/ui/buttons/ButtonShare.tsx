import { Fragment, ReactNode } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ShareIcon from "../icons/ShareIcon";

interface Props {
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}
export default function ButtonFlyout({ className, disabled, children }: Props) {
  const { t } = useTranslation();
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            disabled={disabled}
            className={clsx(
              className,
              "inline-flex space-x-2 items-center px-3 py-2 border shadow-sm text-sm font-medium rounded-md bg-white focus:outline-none focus:ring-2 focus:border-accent-300 border-gray-300",
              disabled && "cursor-not-allowed opacity-75",
              "text-accent-700",
              !disabled && "hover:border-accent-300 hover:text-accent-900 focus:ring-accent-500"
            )}
          >
            <span>{t("shared.share")}</span>
            <ShareIcon className={clsx(open ? "text-gray-700" : "text-gray-600", "h-4 w-4 group-hover:text-gray-500")} aria-hidden="true" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">{children}</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
