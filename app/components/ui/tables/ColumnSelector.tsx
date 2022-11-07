import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "@remix-run/react";
import { ColumnDto } from "~/application/dtos/data/ColumnDto";
import { useOuterClick } from "~/utils/shared/KeypressUtils";
import { updateItemByIdx } from "~/utils/shared/ObjectUtils";
import DotsHorizontalFilledIcon from "../icons/DotsHorizontalFilledIcon";
import InputCheckboxInline from "../input/InputCheckboxInline";

interface Props {
  items: ColumnDto[];
  setItems: React.Dispatch<React.SetStateAction<ColumnDto[]>>;
  onClear: () => void;
}

export default function ColumnSelector({ items, setItems, onClear }: Props) {
  const { t } = useTranslation();

  const [opened, setOpened] = useState(false);

  const clickOutside = useOuterClick(() => setOpened(false));

  return (
    <div ref={clickOutside} className="relative">
      <button
        onClick={() => setOpened(!opened)}
        className="text-sm relative z-0 inline-flex shadow-sm rounded-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
      >
        <span className={clsx("bg-white text-gray-600 relative inline-flex space-x-2 items-center px-2 py-3 border border-gray-300 font-medium rounded-md")}>
          <div>
            <DotsHorizontalFilledIcon className="h-3 w-3" />
          </div>
        </span>
      </button>

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
        <Form
          method="get"
          className="z-40 origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-2xl overflow-visible bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="text-sm px-2 py-2 flex items-center justify-between bg-gray-50">
            <div className="font-bold">{t("shared.columns")}</div>
          </div>
          <div className="text-sm divide-y divide-gray-200">
            {items.map((filter, idx) => {
              return (
                <div key={filter.name} className="divide-y divide-gray-200">
                  <div className="px-2 py-2 divide-y divide-gray-300">
                    <InputCheckboxInline
                      name={filter.name}
                      title={t(filter.title)}
                      value={filter.visible}
                      setValue={(e) => {
                        updateItemByIdx(items, setItems, idx, {
                          visible: Boolean(e),
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Form>
      </Transition>
    </div>
  );
}
