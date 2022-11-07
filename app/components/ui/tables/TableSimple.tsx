import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import RowDisplayValueHelper from "~/utils/helpers/RowDisplayValueHelper";
import ButtonTertiary from "../buttons/ButtonTertiary";
import TablePagination from "./TablePagination";
import { ReactNode } from "react";

interface Props<T> {
  headers: RowHeaderDisplayDto<T>[];
  items: T[];
  actions?: {
    title: string | ReactNode;
    onClick?: (idx: number, item: T) => void;
    onClickRoute?: (idx: number, item: T) => string;
    disabled?: boolean;
    destructive?: boolean;
  }[];
  updatesUrl?: boolean;
  pagination?: PaginationDto;
  onClickRoute?: (idx: number, item: T) => string;
  className?: (idx: number, item: T) => string;
}

export default function TableSimple<T>({ headers, items, actions = [], updatesUrl = false, pagination, onClickRoute, className }: Props<T>) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  function onSortBy(header: RowHeaderDisplayDto<T>) {
    let sort = header.name.toString();
    let direction = "-";
    if (pagination?.sortedBy?.name === header.name) {
      direction = pagination?.sortedBy?.direction === "asc" ? "-" : "";
    }
    sort = direction + sort;
    searchParams.set("page", "1");
    searchParams.set("sort", sort);
    setSearchParams(searchParams);
  }
  return (
    <div className="flex flex-col shadow border border-gray-200 sm:rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, idxHeader) => {
                    return (
                      <th
                        key={idxHeader}
                        onClick={() => header.sortable && onSortBy(header)}
                        scope="col"
                        className={clsx(
                          idxHeader === 0 && "pl-4",
                          "text-xs px-2 py-1 text-left font-medium text-gray-500 tracking-wider select-none truncate",
                          header.sortable && "cursor-pointer hover:text-gray-700",
                          header.breakpoint === "sm" && "hidden sm:table-cell",
                          header.breakpoint === "md" && "hidden mg:table-cell",
                          header.breakpoint === "lg" && "hidden lg:table-cell",
                          header.breakpoint === "xl" && "hidden xl:table-cell",
                          header.breakpoint === "2xl" && "hidden 2xl:table-cell"
                        )}
                      >
                        <div className={clsx("flex items-center space-x-1 text-gray-500", header.className)}>
                          <div>{t(header.title)}</div>
                          <div className={clsx((!header.name || pagination?.sortedBy?.name !== header.name) && "invisible")}>
                            {(() => {
                              if (pagination?.sortedBy?.direction === "asc") {
                                return (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                );
                              } else {
                                return (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                  {actions.length > 0 && (
                    <th scope="col" className="text-xs px-2 py-1 text-left font-medium text-gray-500 tracking-wider select-none truncate"></th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + actions.length} className="text-center">
                      <div className="p-3 text-gray-500 text-sm">{t("shared.noRecords")}</div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, idxRow) => {
                    return (
                      <tr
                        key={idxRow}
                        onClick={() => {
                          if (onClickRoute !== undefined) {
                            navigate(onClickRoute(idxRow, item));
                          }
                        }}
                        className="group"
                      >
                        {headers.map((header, idxHeader) => {
                          return (
                            <td
                              key={idxHeader}
                              className={clsx(
                                idxHeader === 0 && "pl-4",
                                "px-2 py-2 whitespace-nowrap text-sm text-gray-600",
                                header.className,
                                header.breakpoint === "sm" && "hidden sm:table-cell",
                                header.breakpoint === "md" && "hidden mg:table-cell",
                                header.breakpoint === "lg" && "hidden lg:table-cell",
                                header.breakpoint === "xl" && "hidden xl:table-cell",
                                header.breakpoint === "2xl" && "hidden 2xl:table-cell",
                                className && className(idxRow, item)
                              )}
                            >
                              {RowDisplayValueHelper.displayRowValue(t, header, item, idxRow)}
                            </td>
                          );
                        })}
                        {actions && (
                          <td className={clsx("px-2 py-1 whitespace-nowrap text-sm text-gray-600", className && className(idxRow, item))}>
                            <div className="flex space-x-2">
                              {actions.map((action, idx) => {
                                return (
                                  <ButtonTertiary
                                    disabled={action.disabled}
                                    key={idx}
                                    destructive={action.destructive}
                                    onClick={() => {
                                      if (action.onClick) {
                                        action.onClick(idxRow, item);
                                      }
                                    }}
                                    to={action.onClickRoute && action.onClickRoute(idxRow, item)}
                                  >
                                    {action.title}
                                  </ButtonTertiary>
                                );
                              })}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}

                {/* {[...Array(pageSize - items.length)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={headers.length + 1} className="whitespace-nowrap text-sm text-gray-600">
                      <div className="px-2 py-2.5 invisible">No row</div>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {pagination && (
        <TablePagination totalItems={pagination.totalItems} totalPages={pagination.totalPages} page={pagination.page} pageSize={pagination.pageSize} />
      )}
    </div>
  );
}
