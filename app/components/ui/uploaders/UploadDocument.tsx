import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import { FileBase64 } from "~/application/dtos/shared/FileBase64";


interface Props {
  name?: string;
  title?: string;
  accept?: string;
  multiple?: boolean;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  uploadText?: string;
  onDropped?: (base64: string, file: File) => void;
  onDroppedFiles?: (fileBase64: FileBase64[], files: any[]) => void;
}

export default function UploadDocuments({
  name = "uploadmyfile",
  className,
  title = "",
  accept,
  multiple,
  description,
  icon = "",
  disabled,
  onDropped,
  onDroppedFiles,
  uploadText,
}: Props) {
  

  const [isDragging, setIsDragging] = useState(false);
  const [loading] = useState(false);
  const [customClasses, setCustomClasses] = useState("");

  function dragOver(e: any) {
    e.preventDefault();
    if (!loading) {
      setIsDragging(true);
    }
  }
  function dragLeave() {
    setIsDragging(false);
  }
  // async function compressFile(imageFile: File): Promise<File> {
  //   const options = {
  //     maxSizeMB: 0.5,
  //     maxWidthOrHeight: 1920 / 2,
  //     useWebWorker: true,
  //   };
  //   try {
  //     return await imageCompression(imageFile, options);
  //   } catch (error) {
  //     return await Promise.reject(error);
  //   }
  // }
  // async function compressFileNotImage(imageFile: File): Promise<File> {
  //   return Promise.resolve(imageFile);
  // }
  async function drop(e: any) {
    try {
      e.preventDefault();
    } catch {
      // ignore
    }
    const files: File[] = await Promise.all(
      [...e.dataTransfer.files].map(async (element: File) => {
        return element;
        // if (element.type.includes("image")) {
        //   return await compressFile(element);
        // } else {
        //   return await compressFileNotImage(element);
        // }
      })
    );
    const filesArray: FileBase64[] = [];

    await Promise.all(
      files.map(async (file) => {
        const base64 = await getBase64(file);
        filesArray.push({
          base64,
          file,
        });
        if (onDropped) {
          onDropped(base64, file);
        }
      })
    );
    if (onDroppedFiles) {
      onDroppedFiles(filesArray, files);
    }
    setIsDragging(false);
  }
  function requestUploadFile() {
    const src = document.querySelector("#" + name);
    drop({ dataTransfer: src });
  }
  function getBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (ev) => {
        resolve(ev?.target?.result?.toString() ?? "");
      };
      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    setCustomClasses(isDragging && !loading && !disabled ? "bg-theme-200 border-2 border-dashed border-theme-800" : "");
  }, [isDragging, loading, disabled]);

  return (
    <div
      className={clsx(
        "text-gray-600 overflow-hidden drop text-center flex border-2 border-dashed border-gray-300 rounded-t-md items-center",
        customClasses,
        className
      )}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={drop}
    >
      {(() => {
        if (loading) {
          return <div className="mx-auto font-medium text-base">Loading...</div>;
        } else {
          return (
            <div>
              <h3 className="mx-auto font-bold text-sm text-theme-500">{title}</h3>
              <div className="manual">
                <div className="space-y-1 text-center">
                  {icon}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor={name}
                      className={clsx(
                        "relative cursor-pointer rounded-md font-medium text-theme-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-500",
                        !disabled && "hover:text-theme-500"
                      )}
                    >
                      <span></span>
                      <label htmlFor={name}>
                        <p className={clsx("font-semibold text-sm underline", !disabled ? "hover:text-theme-500 cursor-pointer" : "cursor-not-allowed")}>
                          {uploadText ?? "Upload file"}
                        </p>
                      </label>
                      <input
                        className="uploadmyfile"
                        disabled={disabled}
                        type="file"
                        id={name}
                        accept={accept}
                        multiple={multiple}
                        onChange={requestUploadFile}
                      />
                    </label>
                    <p className="pl-1 lowercase">
                      or Drag and drop here
                      
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}
