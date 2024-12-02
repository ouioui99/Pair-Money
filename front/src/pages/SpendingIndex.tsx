import React from "react";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import { SpendingIndexList } from "../types";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";

export default function SpendingIndex() {
  return (
    <>
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">支出一覧</h1>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => console.log("新規作成ボタンがクリックされました")}
        >
          新規作成
        </button> */}
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader
            tHeaders={["amount", "date", "category", "action"]}
          />
          <SpendingIndexListTBody<SpendingIndexList[]>
            tbodyList={[{ amount: 1000, date: "2024/10/30", category: "test" }]}
            handleEdit={function (index: number): void {
              throw new Error("Function not implemented.");
            }}
            handleDelete={function (index: number): void {
              throw new Error("Function not implemented.");
            }}
          />
        </table>
        {/* モバイルビュー */}
        <SpendingIndexListMobile<SpendingIndexList[]>
          tbodyList={[{ amount: 1000, date: "2024/10/30", category: "test" }]}
          handleEdit={function (index: number): void {
            throw new Error("Function not implemented.");
          }}
          handleDelete={function (index: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </>
  );
}
