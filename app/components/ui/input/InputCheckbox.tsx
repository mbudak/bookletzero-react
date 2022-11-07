import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";

export interface RefInputCheckbox {
  input: RefObject<HTMLInputElement>;
}

interface Props {
  name: string;
  title: string;
  withLabel?: boolean;
  value?: boolean;
  setValue?: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  asToggle?: boolean;
  readOnly?: boolean;
  hint?: ReactNode;
  help?: string;
  icon?: string;
}
const InputCheckbox = (
  { name, title, withLabel = true, value, setValue, className, required, disabled, asToggle, readOnly, hint, help, icon }: Props,
  ref: Ref<RefInputCheckbox>
) => {
  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);

  const [toggle, setToggle] = useState(value ?? false);

  useEffect(() => {
    if (setValue && value !== toggle) {
      setValue(toggle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  return (
    <div className={className}>
      {withLabel && (
        <label htmlFor={name} className="flex justify-between space-x-2 text-xs font-medium text-gray-600 ">
          <div className=" flex space-x-1 items-center">
            <div className="truncate">
              {title}
              {required && <span className="ml-1 text-red-500">*</span>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {hint}
        </label>
      )}
      <div className={clsx("flex rounded-md w-full relative", withLabel && "mt-1")}>
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
          </div>
        )}
        {asToggle ? (
          <Switch
            checked={toggle}
            onChange={setToggle}
            disabled={disabled || readOnly}
            className={clsx(
              toggle ? "bg-accent-600" : "bg-gray-200",
              "relative inline-flex flex-shrink-0 h-5 w-8 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500",
              icon && "pl-10"
            )}
          >
            <input type="hidden" readOnly name={name} value={value === true ? "true" : "false"} />
            <span
              aria-hidden="true"
              className={clsx(
                toggle ? "translate-x-3" : "translate-x-0",
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        ) : (
          <input
            type="checkbox"
            id={name}
            name={name}
            defaultChecked={value}
            readOnly={readOnly}
            onChange={(e) => (setValue ? setValue(e.target.checked) : {})}
            disabled={disabled}
            className={clsx(
              (disabled || readOnly) && "bg-gray-100 cursor-not-allowed",
              "mt-1 cursor-pointer focus:ring-accent-500 h-6 w-6 text-accent-800 border-gray-300 rounded",
              className,
              icon && "pl-10"
            )}
          />
        )}
      </div>
    </div>
  );
};
export default forwardRef(InputCheckbox);
