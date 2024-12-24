import React from "react";

interface Props {
  fixedCosts: FixedCostType[];
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

interface FixedCostType {
  member: string;
}

export default function FixedCostsIndexList(props: Props) {
  return (
    <div>
      <div>
        <header className="p-4 border-b">
          <h1 className="text-xl font-semibold">メンバー一覧</h1>
        </header>

        {/* Responsive Table */}
        <div className="overflow-hidden">
          {/* Desktop View */}
          <table className="min-w-full hidden md:table table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">メンバー名</th>
                <th className="p-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {props.fixedCosts.map((members, index) => (
                <tr key={index} className="border-t hover:bg-gray-200">
                  <td className="p-4 whitespace-nowrap">{members.member}</td>
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

          {/* Mobile View */}
          <div className="block md:hidden">
            {props.fixedCosts.map((fixedCost, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-md mb-4"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">金額</span>
                  <span>{fixedCost.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">カテゴリー</span>
                  <span>{fixedCost.category}</span>
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  {/* 編集ボタン */}
                  <button
                    onClick={() => props.handleEdit(index)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
