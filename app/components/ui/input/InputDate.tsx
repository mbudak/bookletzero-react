import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useImperativeHandle, useRef } from "react";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";

export interface RefInputDate {
  input: RefObject<HTMLInputElement>;
}

interface Props {
  name: string;
  title: string;
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  help?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  hint?: ReactNode;
  icon?: string;
  darkMode?: boolean;
}
const InputDate = (
  { name, title, value, defaultValue, onChange, className, help, disabled = false, readOnly = false, required = false, hint, icon, darkMode }: Props,
  ref: Ref<RefInputDate>
) => {
  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className={clsx(className, !darkMode && "text-gray-800")}>
      <label htmlFor={name} className="flex justify-between space-x-2 text-xs font-medium text-gray-600">
        <div className=" flex space-x-1 items-center">
          <div className="truncate">
            {title}
            {required && <span className="ml-1 text-red-500">*</span>}
          </div>

          {help && <HintTooltip text={help} />}
        </div>
        {hint}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm w-full relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
          </div>
        )}
        <input
          ref={input}
          type="date"
          id={name}
          name={name}
          required={required}
          defaultValue={defaultValue ? new Date(defaultValue).toISOString().split("T")[0] : ""}
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          onChange={(e) => (onChange ? onChange(e.target.valueAsDate || new Date()) : {})}
          disabled={disabled}
          readOnly={readOnly}
          className={clsx(
            "w-full flex-1 focus:ring-accent-500 focus:border-accent-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
            className,
            (disabled || readOnly) && "bg-gray-100 cursor-not-allowed",
            icon && "pl-10"
          )}
        />
      </div>
    </div>
  );
};
export default forwardRef(InputDate);
