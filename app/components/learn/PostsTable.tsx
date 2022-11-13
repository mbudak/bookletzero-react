import { useTranslation } from "react-i18next";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import DateUtils from "~/utils/shared/DateUtils";
import { useState } from "react";
import clsx from "~/utils/shared/ClassesUtils";
import { LearnPostWithDetails } from "~/utils/db/learn.db.server";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import PostTags from "./PostTags";
import InputSearch from "../ui/input/InputSearch";

interface Props {
  items: LearnPostWithDetails[];
}

type Header = {
  title: string;
  name?: string;
  sortable?: boolean;
};

export default function PostsTable({ items }: Props) {
  

  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        DateUtils.dateYMDHMS(f.createdAt)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.slug?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.title?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        DateUtils.dateYMDHMS(f.date).includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.content?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        
        (f.author.firstName + " " + f.author.lastName)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.category.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.tags
          .map((f) => f.tag)
          ?.toString()
          .toUpperCase()
          .includes(searchInput.toUpperCase())
    );
  };

  const [sortByColumn, setSortByColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState(1);

  const headers: Header[] = [
    {
      name: "title",
      title: "Object",
    },
    {
      title: "Category",
    },
    {
      title: "Author",
    },
    {
      title: "Actions",
    },
  ];

  function sortBy(column: string | undefined) {
    if (column) {
      setSortDirection(sortDirection === -1 ? 1 : -1);
      setSortByColumn(column);
    }
  }

  const sortedItems = () => {
    if (!filteredItems()) {
      return [];
    }
    const column = sortByColumn;
    if (!column) {
      return filteredItems();
    }
    return filteredItems()
      .slice()
      .sort((x: any, y: any) => {
        if (x[column] && y[column]) {
          if (sortDirection === -1) {
            return (x[column] > y[column] ? 1 : -1) ?? 1;
          } else {
            return (x[column] < y[column] ? 1 : -1) ?? 1;
          }
        }
        return 1;
      });
  };

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <div>
        {(() => {
          if (sortedItems().length === 0) {
            return (
              <div>
                <EmptyState
                  className="bg-white"
                  captions={{
                    thereAreNo: "No Records yet",
                  }}
                  icon="plus"
                />
              </div>
            );
          } else {
            return (
              <div className="flex flex-col">
                <div className="overflow-x-auto">
                  <div className="align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {headers.map((header, idx) => {
                              return (
                                <th
                                  key={idx}
                                  onClick={() => sortBy(header.name)}
                                  scope="col"
                                  className={clsx(
                                    "px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none",
                                    header.name && "cursor-pointer hover:text-gray-700"
                                  )}
                                >
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <div>{header.title}</div>
                                    <div className={clsx((!header.name || sortByColumn !== header.name) && "invisible")}>
                                      {(() => {
                                        if (sortDirection === -1) {
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
                          </tr>
                        </thead>
                        {sortedItems().map((item, idx) => {
                          return (
                            <tbody key={idx} className="bg-white divide-y divide-gray-200">
                              <tr className=" text-gray-600">
                                <td className="px-2 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  <div className="flex flex-col">
                                    <div>
                                      {item.title}{" "}
                                      <span>
                                        {item.published ? (
                                          <span className="text-teal-500 text-xs">{/* ({t("learn.published")}) */}</span>
                                        ) : (
                                          <span className="text-red-500 text-xs">Draft</span>
                                        )}
                                      </span>
                                    </div>
                                    <a href={"/learn/" + item.slug} target="_blank" rel="noreferrer" className="text-gray-400 underline">
                                      {item.slug}
                                    </a>
                                  </div>
                                </td>

                                <td className="px-2 py-2 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    <div className="">
                                      <span className="font-medium">{item.category.name}</span>{" "}
                                      {item.totalQuestions && <span className="text-gray-400 italic">({item.totalQuestions})</span>}
                                    </div>
                                    <PostTags items={item.tags} />
                                  </div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm">
                                  <div className="flex flex-col">
                                    <div>
                                      {item.author.firstName} {item.author.lastName}
                                    </div>
                                    <div className="text-xs text-gray-400">{DateUtils.dateYMDHMS(item.date)}</div>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex items-center space-x-2">
                                    <ButtonTertiary to={"/admin/learn/" + item.id}>Edit</ButtonTertiary>
                                    <ButtonTertiary to={"/learn/" + item.slug} target="_blank">
                                      Preview
                                    </ButtonTertiary>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
