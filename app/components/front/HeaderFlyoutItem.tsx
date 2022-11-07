/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { NavbarItemDto } from "~/application/dtos/marketing/NavbarItemDto";
import { Link } from "@remix-run/react";
import ChevronDownIcon from "../ui/icons/ChevronDownIcon";

interface Props {
  title: string;
  items?: NavbarItemDto[];
  className?: string;
}
export default function HeaderFlyoutItem({ title, items, className }: Props) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={clsx(
              className,
              open ? "text-gray-900" : "text-gray-500",
              "group w-full rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none space-x-2 truncate "
            )}
          >
            <span>{title}</span>
            <ChevronDownIcon className={clsx(open ? "text-gray-600" : "text-gray-400", "h-5 w-5 group-hover:text-gray-500")} aria-hidden="true" />
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
            <Popover.Panel className="absolute z-20 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  {items?.map((item) => (
                    <Fragment key={item.title}>
                      {item.path?.startsWith("https:") ? (
                        <a href={item.path ?? "#"} className="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                          <p className="text-base font-medium text-gray-900">{item.title}</p>
                          {item.description && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}
                        </a>
                      ) : (
                        <Link to={item.path ?? "#"} className="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150">
                          <p className="text-base font-medium text-gray-900">{item.title}</p>
                          {item.description && <p className="mt-1 text-sm text-gray-500">{item.description}</p>}
                        </Link>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}