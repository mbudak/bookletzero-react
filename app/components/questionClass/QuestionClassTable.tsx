import clsx from "clsx";
import { useState } from "react";
import { QuestionClassWithDetails } from "~/utils/db/questionClass.db.server";
import DateUtils from "~/utils/shared/DateUtils";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import EmptyState from "../ui/emptyState/EmptyState";
import InputSearch from "../ui/input/InputSearch";

interface Props{
    items: QuestionClassWithDetails[];
}

type Header = {
    title: string;
    name?: string;
    sortable?: boolean;
};

  
export default function QuestionClassTable({items}: Props) {
    const [searchInput, setSearchInput] = useState("");
    const filteredItems = () => {
        if (!items) {
            return []
        }
        return items.filter(
            (f) => 
            f.title?.toString().toUpperCase().includes(searchInput.toUpperCase())
        );
    };

    const headers: Header[] = [
        {
            name: "title",
            title: "Name"
        },
        {
            title: "Questions"
        },
        {
            title: "Actions"
        }
    ]


    return (
        <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <div>
        {(() => {
          if (filteredItems().length === 0) {
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
                                 
                                  scope="col"
                                  className={
                                    "px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none"
                                    
                                  }
                                >
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <div>{header.title}</div>                                    
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        {filteredItems().map((item, idx) => {
                          return (
                            <tbody key={idx} className="bg-white divide-y divide-gray-200">
                              <tr className=" text-gray-600">
                                <td className="px-2 py-2 whitespace-nowrap text-gray-700 text-sm">
                                  <div className="flex flex-col">
                                    <div>
                                      {item.title}{" "}
                                      <span>
                                        {item.title ? (
                                          <span className="text-teal-500 text-xs">{/* ({t("learn.published")}) */}</span>
                                        ) : (
                                          <span className="text-red-500 text-xs">Draft</span>
                                        )}
                                      </span>
                                    </div>
                                    <a href={"/admin/classes/" + item.id} target="_self" rel="noreferrer" className="text-gray-400 underline">
                                      {item.path}
                                    </a>
                                  </div>
                                </td>

                                <td className="px-2 py-2 whitespace-nowrap text-xs">
                                  <div className="flex flex-col">
                                    <div className="">
                                      <span className="font-medium">Total</span>{" "}
                                      {item.id && <span className="text-gray-400 italic">{item.cumulative}</span>}
                                    </div>
                                    {/* <PostTags items={item.tags} /> */} 
                                  </div>
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap text-sm">
                                  <div className="flex flex-col">
                                    <div>
                                      {item.title} {item.title}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Date here... {/* {DateUtils.dateYMDHMS(item.createdAt)}*/ }
                                    </div>
                                  </div> 
                                </td>
                                <td>
                                  <div className="flex items-center space-x-2">
                                    <ButtonTertiary to={"/admin/learn/" + item.id}>Edit</ButtonTertiary>
                                    <ButtonTertiary to={"/learn/" + item.id} target="_blank">
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