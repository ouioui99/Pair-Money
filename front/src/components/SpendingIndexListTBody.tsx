import { SpendingIndexList, IndexListTbody } from "../types";
import dayjs from "dayjs";
import { convertIdToName } from "../util/commonFunc";

const SpendingIndexListTBody = <T extends SpendingIndexList>({
  tbodyList,
  handleEdit,
  handleDelete,
  groupMemberDataList,
  categoryDataList,
}: IndexListTbody<T>) => {
  let forDisplayCategoryDataList: { id: string; name: string }[];
  if (categoryDataList) {
    forDisplayCategoryDataList = categoryDataList.map((categoryDataObject) => {
      return {
        id: categoryDataObject.id,
        name: categoryDataObject.data.name,
      };
    });
  }

  return (
    <tbody>
      {tbodyList.map((spendingData, index) => (
        <tr key={index} className="border-t hover:bg-gray-200">
          <td className="p-4 whitespace-nowrap">
            {dayjs(spendingData.data.date.toDate()).format("YYYY-MM-DD")}
          </td>
          <td className="p-4">
            ￥{Number(spendingData.data.amount).toLocaleString()}
          </td>
          {/* 共通口座バッジ表示 */}
          <td className="p-4 w-17 whitespace-nowrap">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                spendingData.data.commonAccountPaid
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {spendingData.data.commonAccountPaid
                ? "共通支払い"
                : "個別支払い"}
            </span>
          </td>
          <td className="p-4">
            {convertIdToName(
              spendingData.data.payerUid,
              "uid",
              "name",
              groupMemberDataList
            )}
          </td>
          <td className="p-4">
            {convertIdToName(
              spendingData.data.categoryId,
              "id",
              "name",
              forDisplayCategoryDataList
            )}
          </td>

          <td className="p-4">
            {/* 編集ボタン */}
            <button
              onClick={() => handleEdit(spendingData.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
            >
              編集
            </button>
            {/* 削除ボタン */}
            <button
              onClick={() => handleDelete(spendingData.id, spendingData)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              削除
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default SpendingIndexListTBody;
