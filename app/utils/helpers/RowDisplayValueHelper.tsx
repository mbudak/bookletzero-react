import { Link } from "@remix-run/react";
import { TFunction } from "i18next";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { InputType } from "~/application/enums/shared/InputType";
import InputNumber from "~/components/ui/input/InputNumber";
import InputSelect from "~/components/ui/input/InputSelect";
import InputText from "~/components/ui/input/InputText";

function displayRowValue<T>(t: TFunction, header: RowHeaderDisplayDto<T>, item: T, idxRow: number) {
  return (
    <>
      {!header.setValue ? (
        <>
          {header.href !== undefined ? (
            <Link to={header.href(item)} className="border-b border-transparent border-dashed hover:border-gray-400 rounded-md focus:bg-gray-100">
              <span>{header.formattedValue ? header.formattedValue(item, idxRow) : header.value(item)}</span>
            </Link>
          ) : (
            <span>{header.formattedValue ? header.formattedValue(item, idxRow) : header.value(item)}</span>
          )}
        </>
      ) : (
        <>
          {header.type === undefined || header.type === InputType.TEXT ? (
            <InputText
              withLabel={false}
              name={header.name}
              title={t(header.title)}
              value={header.value(item)}
              disabled={header.editable && !header.editable(item)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(e, idxRow);
                }
              }}
              required
            />
          ) : header.type === InputType.NUMBER ? (
            <InputNumber
              withLabel={false}
              name={header.name}
              title={t(header.title)}
              value={header.value(item)}
              disabled={header.editable && !header.editable(item)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(e, idxRow);
                }
              }}
              required
            />
          ) : header.type === InputType.SELECT ? (
            <InputSelect
              withLabel={false}
              name={header.name}
              title={t(header.title)}
              value={header.value(item)}
              setValue={(e) => {
                if (header.setValue) {
                  header.setValue(Number(e), idxRow);
                }
              }}
              options={header.options ?? []}
              required
              disabled={header.editable && !header.editable(item)}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

// function displayTableCells(t: TFunction, entity: EntityWithDetails, item: RowWithDetails, columns: ColumnDto[]) {
//   function getEditRoute(item: RowWithDetails) {
//     if (item.tenant) {
//       return `/app/${item.tenant.slug}/${entity.slug}/${item.id}`;
//     } else {
//       return `${item.id}`;
//     }
//   }
//   return (
//     <>
//       {RowDisplayHeaderHelper.isColumnVisible(columns, "tenant") && (
//         <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//           <Link className="hover:underline" to={`/app/${item.tenant?.slug}`}>
//             {item.tenant?.name}
//           </Link>
//         </td>
//       )}
//       {RowDisplayHeaderHelper.isColumnVisible(columns, "folio") && (
//         <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//           <Link
//             to={`/app/${item.tenant?.slug}/${entity.slug}/${item.id}`}
//             className="uppercase p-2 hover:bg-gray-50 border border-transparent hover:border-gray-300 rounded-md focus:bg-gray-100"
//           >
//             {RowHelper.getRowFolio(entity, item)}
//           </Link>
//         </td>
//       )}

//       {entity.properties
//         .filter((f) => !f.isHidden && !f.isDetail)
//         .map((property) => {
//           return (
//             <td key={property.name} className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//               {property.type === PropertyType.ENTITY ? (
//                 <Link
//                   to={`/app/${item.tenant?.slug}/${RowHelper.getPropertyValue(entity, item, property)?.entity.slug}/${
//                     RowHelper.getPropertyValue(entity, item, property).id
//                   }`}
//                   className="p-2 hover:bg-gray-50 border border-transparent hover:border-gray-300 rounded-md focus:bg-gray-100"
//                 >
//                   <span>{RowHelper.getCellValue(entity, item, property)}</span>
//                 </Link>
//               ) : (
//                 <span>{RowHelper.getCellValue(entity, item, property)}</span>
//               )}
//               {/* {JSON.stringify(item)} */}
//             </td>
//           );
//         })}

//       {entity.properties.filter((f) => f.isDetail).length > 0 && <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">{item.details.length}</td>}
//       <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//         <div className="text-gray-400 text-xs">{DateUtils.dateAgo(item.createdAt)}</div>
//       </td>
//       <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//         <div className="flex flex-col">
//           <div>
//             {/* {item.createdByUser.firstName} {item.createdByUser.lastName}{" "} */}
//             <span className="text-gray-400 text-xs">{item.createdByUser?.email ?? (item.createdByApiKey ? "API" : "?")}</span>
//           </div>
//         </div>
//       </td>
//       <td className="w-20 px-2 py-1 whitespace-nowrap text-sm text-gray-600">
//         <div className="flex items-center space-x-2">
//           <ButtonTertiary to={getEditRoute(item)}>{t("shared.edit")}</ButtonTertiary>
//         </div>
//       </td>
//     </>
//   );
// }

export default {
  displayRowValue,
};
