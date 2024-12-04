import React from "react";
import { SpendingIndexList, IndexListTbody } from "../types";

const SpendingIndexListTBody = <T extends SpendingIndexList[]>({
  tbodyList,
  handleEdit,
  handleDelete,
}: IndexListTbody<T>) => {
  return (
    <tbody>
      {tbodyList.map((fixedCost, index) => (
        <tr key={index} className="border-t hover:bg-gray-200">
          <td className="p-4 whitespace-nowrap">{fixedCost.date}</td>
          <td className="p-4">{fixedCost.amount}</td>
          <td className="p-4">{fixedCost.category}</td>
          <td className="p-4">
            {/* 編集ボタン */}
            <button
              onClick={() => handleEdit("aa")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
            >
              編集
            </button>
            {/* 削除ボタン */}
            <button
              //onClick={() => handleDelete(index)}
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
