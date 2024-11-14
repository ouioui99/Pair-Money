import React from "react";

interface Props {
  fixedCosts: FixedCostType[];
}

interface FixedCostType {
  amount: number;
  category: string;
}

export default function FixedCostsIndexList(items: Props) {
  return (
    <div>
      <div>
        <header className="p-4 border-b ">
          <h1 className="text-xl font-semibold">固定費一覧</h1>
        </header>

        {/* Responsive Table */}
        <div className="overflow-hidden">
          <table className="min-w-full hidden md:table table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">金額</th>
                <th className="p-4">カテゴリー</th>
              </tr>
            </thead>
            <tbody>
              {items.fixedCosts.map((fixedCost, index) => (
                <tr key={index} className="border-t hover:bg-gray-200">
                  {/* ホバー時の色を設定 */}
                  <td className="p-4 whitespace-nowrap">{fixedCost.amount}</td>
                  <td className="p-4">{fixedCost.category}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="block md:hidden">
            {items.fixedCosts.map((fixedCost, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-md" // ホバー時の色を設定
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">金額</span>
                  <span>{fixedCost.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">カテゴリー</span>
                  <span>{fixedCost.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
