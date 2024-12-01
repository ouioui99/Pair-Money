import React from "react";

interface IndexLisHeader<T> {
  header: string;
  tHeaders: string[];
  tbody: T;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

const SpendingIndexListTBody = () => {
  return (
    <table className="min-w-full hidden md:table table-auto">
      <thead>
        <tr className="bg-gray-100 text-left">
          {props.tHeaders.map((tHeader) => {
            return <th className="p-4">{tHeader}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {props.tbody.map((fixedCost, index) => (
          <tr key={index} className="border-t hover:bg-gray-200">
            <td className="p-4 whitespace-nowrap">{fixedCost.date}</td>
            <td className="p-4">{fixedCost.amount}</td>
            <td className="p-4">{fixedCost.category}</td>
            <td className="p-4">
              {/* 編集ボタン */}
              <button
                onClick={() => props.handleEdit(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
              >
                編集
              </button>
              {/* 削除ボタン */}
              <button
                onClick={() => props.handleDelete(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SpendingIndexListTBody;
