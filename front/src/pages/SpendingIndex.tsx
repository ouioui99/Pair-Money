import React from "react";
import SpendingIndexList from "../components/IndexListTHeader";
import IndexListTHeader from "../components/IndexListTHeader";

export default function SpendingIndex() {
  return (
    <>
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">支出一覧</h1>
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader
            tHeaders={["amount", "date", "category", "action"]}
            // tbody={[{ amount: 1000, date: "2024/10/30", category: "test" }]}
            // handleEdit={function (index: number): void {
            //   throw new Error("Function not implemented.");
            // }}
            // handleDelete={function (index: number): void {
            //   throw new Error("Function not implemented.");
            // }}
          ></IndexListTHeader>
        </table>
      </div>
    </>
  );
}
