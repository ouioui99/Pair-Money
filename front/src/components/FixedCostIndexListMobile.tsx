import React from "react";
import {
  SpendingIndexList,
  IndexListTbody,
  CommonResponseData,
  SpendingResponse,
  FixedCostsResponse,
} from "../types";

export default function FixedCostIndexListMobile<
  T extends CommonResponseData<FixedCostsResponse>
>({ tbodyList, handleEdit, handleDelete }: IndexListTbody<T>) {
  return (
    <div className="block md:hidden">
      {tbodyList.map((fixedCostData, index) => (
        <div
          key={index}
          className="border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl mb-6 transition-all duration-300 ease-in-out"
        >
          <div className="flex justify-between mb-3">
            <span className="font-medium text-gray-700 text-lg">金額</span>
            <span className="text-xl font-semibold text-gray-900">
              {fixedCostData.data.amount}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="font-medium text-gray-700 text-lg">
              カテゴリー
            </span>
            <span className="text-xl font-semibold text-gray-900">
              {fixedCostData.data.category}
            </span>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            {/* 編集ボタン */}
            <button
              onClick={() => handleEdit(fixedCostData.id)}
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
              onClick={() => handleDelete(fixedCostData.id, fixedCostData)}
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
  );
}
