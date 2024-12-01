import React from "react";

interface Props {
  fixedCosts: { data: CategoryData; id: string }[];
  handleEdit: (index: string) => void;
  handleDelete: (
    selectedDocumentID: string,
    selectedCategoryName: string
  ) => void;
}

interface CategoryData {
  category: string;
  uid: string;
}

export default function MoneyTypeIndexList(props: Props) {
  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
        <header className="p-6 bg-gray-600 text-white rounded-t-lg">
          <h1 className="text-2xl font-semibold">支出カテゴリー</h1>
        </header>

        {/* Responsive Table */}
        <div className="overflow-hidden">
          {/* Desktop View */}
          <table className="min-w-full hidden md:table table-auto">
            <thead>
              <tr className="bg-indigo-50 text-left text-gray-700">
                <th className="p-4 text-sm font-semibold">カテゴリー</th>
                <th className="p-4 text-sm font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {props.fixedCosts.map((fixedCost, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-indigo-100 transition"
                >
                  <td className="p-4 whitespace-nowrap text-gray-800 flex-grow">
                    {fixedCost.data.category}
                  </td>
                  <td className="p-4 flex justify-end space-x-1">
                    {/* 編集ボタン */}
                    <button
                      onClick={() => props.handleEdit(fixedCost.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 3l4 4m0 0l-10 10L3 19l2-8 10-10z"
                        />
                      </svg>
                      <span>編集</span>
                    </button>
                    {/* 削除ボタン */}
                    <button
                      onClick={() =>
                        props.handleDelete(
                          fixedCost.id,
                          fixedCost.data.category
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>削除</span>
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
                className="border rounded-lg p-6 bg-white shadow-lg mb-6 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600 font-medium text-lg">
                    カテゴリー
                  </span>
                  <span className="text-gray-800 font-semibold text-lg">
                    {fixedCost.data.category}
                  </span>
                </div>
                <div className="flex justify-end mt-4 space-x-4">
                  {/* 編集ボタン */}
                  <button
                    onClick={() => props.handleEdit(fixedCost.id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 3l4 4m0 0l-10 10L3 19l2-8 10-10z"
                      />
                    </svg>
                    <span>編集</span>
                  </button>
                  {/* 削除ボタン */}
                  <button
                    onClick={() =>
                      props.handleDelete(fixedCost.id, fixedCost.data.category)
                    }
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>削除</span>
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
