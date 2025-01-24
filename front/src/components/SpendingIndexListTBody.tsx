import { SpendingIndexList, IndexListTbody } from "../types";
import dayjs from "dayjs";
import { convetMemberIdToMemberName } from "../util/commonFunc";

const SpendingIndexListTBody = <T extends SpendingIndexList>({
  tbodyList,
  handleEdit,
  handleDelete,
  groupMemberDataList,
}: IndexListTbody<T>) => {
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
          <td className="p-4">
            {convetMemberIdToMemberName(
              spendingData.data.payerUid,
              groupMemberDataList
            )}
          </td>
          <td className="p-4">{spendingData.data.categoryId}</td>
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
