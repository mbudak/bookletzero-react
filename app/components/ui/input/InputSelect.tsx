import { ReactNode } from "react";
import clsx from "~/utils/shared/ClassesUtils";
import HintTooltip from "../tooltips/HintTooltip";

interface Props {
  name: string;
  title: string;
  withLabel?: boolean;
  options: { name: string; value: string | number | undefined; disabled?: boolean }[];
  value?: string | number | undefined;
  setValue?: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  help?: string;
  hint?: ReactNode;
}
export default function InputSelect({ name, title, withLabel = true, value, options, setValue, className, required, disabled, help, hint }: Props) {
  return (
    <div className={clsx(className, "flex-grow w-full text-gray-800")}>
      {withLabel && (
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
      )}
      <div className={clsx(withLabel && "mt-1")}>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => (setValue ? setValue(e.currentTarget.value) : {})}
          className={clsx(
            "w-full flex-1 focus:ring-accent-500 focus:border-accent-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
            className,
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {options.map((item, idx) => {
            return (
              <option key={idx} value={item.value} disabled={item.disabled}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
