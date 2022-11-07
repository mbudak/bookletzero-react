import clsx from "clsx";
import { forwardRef, ReactNode, Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";
import Editor from "@monaco-editor/react";

export interface RefInputText {
  input: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
}

interface Props {
  name: string;
  title: string;
  withLabel?: boolean;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  classNameBg?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  withTranslation?: boolean;
  translationParams?: string[];
  placeholder?: string;
  pattern?: string;
  rows?: number;
  button?: ReactNode;
  lowercase?: boolean;
  uppercase?: boolean;
  type?: string;
  darkMode?: boolean;
  hint?: ReactNode;
  help?: string;
  icon?: string;
  editor?: string; // monaco
  editorLanguage?: string; // "javascript" | "typescript" | "html" | "css" | "json";
  editorHideLineNumbers?: boolean;
  editorTheme?: "vs-dark" | "light";
  onBlur?: () => void;
}
const InputText = (
  {
    name,
    title,
    withLabel = true,
    value,
    setValue,
    className,
    classNameBg,
    help,
    disabled = false,
    readOnly = false,
    required = false,
    minLength,
    maxLength,
    autoComplete,
    withTranslation = false,
    translationParams = [],
    placeholder,
    pattern,
    hint,
    rows,
    button,
    lowercase,
    uppercase,
    type = "text",
    darkMode,
    icon,
    editor,
    editorLanguage,
    editorHideLineNumbers,
    editorTheme = "vs-dark",
    onBlur,
  }: Props,
  ref: Ref<RefInputText>
) => {
  const { t, i18n } = useTranslation();

  const [actualValue, setActualValue] = useState<string>(value ?? "");

  useEffect(() => {
    setActualValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  function getTranslation(value: string) {
    if (!i18n.exists(value)) {
      return null;
    }
    return t(value);
  }

  function onChange(value: string) {
    if (setValue) {
      if (lowercase) {
        setValue(value.toLowerCase());
      } else if (uppercase) {
        setValue(value.toUpperCase());
      } else {
        setValue(value);
      }
    }
  }

  return (
    <div className={clsx(className, !darkMode && "text-gray-800")}>
      {withLabel && (
        <label htmlFor={name} className="flex justify-between space-x-2 text-xs font-medium text-gray-600 ">
          <div className=" flex space-x-1 items-center">
            <div className="truncate">
              {title}
              {required && <span className="ml-1 text-red-500">*</span>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {withTranslation && value?.includes(".") && (
            <div className="text-slate-600 font-light italic">
              {t("admin.pricing.i18n")}:{" "}
              {getTranslation(value) ? (
                <span className="text-slate-600">{t(value, translationParams ?? [])}</span>
              ) : (
                <span className="text-red-600">{t("shared.invalid")}</span>
              )}
            </div>
          )}
          {hint}
        </label>
      )}
      <div className={clsx("flex rounded-md w-full relative", withLabel && "mt-1")}>
        {editor === "monaco" && editorLanguage ? (
          <>
            <textarea hidden readOnly name={name} value={actualValue} />
            <Editor
              theme={editorTheme}
              className={clsx(
                className,
                classNameBg,
                "h-64 w-full flex-1 focus:ring-accent-500 focus:border-accent-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                editorHideLineNumbers && "-ml-10"
              )}
              defaultLanguage={editorLanguage}
              language={editorLanguage}
              defaultValue={value}
              value={actualValue}
              onChange={(e) => setActualValue(e?.toString() ?? "")}
            />
          </>
        ) : !rows ? (
          <>
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
              </div>
            )}
            <input
              ref={input}
              type={type}
              id={name}
              name={name}
              autoComplete={autoComplete}
              required={required}
              minLength={minLength}
              maxLength={maxLength}
              defaultValue={value}
              value={actualValue}
              onChange={(e) => setActualValue(e.currentTarget.value)}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              pattern={pattern !== "" && pattern !== undefined ? pattern : undefined}
              className={clsx(
                "w-full flex-1 focus:ring-accent-500 focus:border-accent-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
                className,
                classNameBg,
                (disabled || readOnly) && "bg-gray-100 cursor-not-allowed",
                icon && "pl-10"
              )}
            />
            {button}
          </>
        ) : (
          <textarea
            rows={rows}
            ref={textArea}
            id={name}
            name={name}
            autoComplete={autoComplete}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            defaultValue={value}
            value={actualValue}
            onChange={(e) => setActualValue(e.currentTarget.value)}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={clsx(
              "w-full flex-1 focus:ring-accent-500 focus:border-accent-500 block min-w-0 rounded-md sm:text-sm border-gray-300",
              className,
              classNameBg,
              (disabled || readOnly) && "bg-gray-100 cursor-not-allowed"
            )}
          />
        )}
      </div>
    </div>
  );
};
export default forwardRef(InputText);
