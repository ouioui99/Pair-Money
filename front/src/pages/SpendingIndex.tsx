import React from "react";
import SpendingIndexList from "../components/SpendingIndexList";

export default function SpendingIndex() {
  return (
    <SpendingIndexList
      fixedCosts={[{ amount: 1000, date: "2024/10/30", category: "test" }]}
      handleEdit={function (index: number): void {
        throw new Error("Function not implemented.");
      }}
      handleDelete={function (index: number): void {
        throw new Error("Function not implemented.");
      }}
    ></SpendingIndexList>
  );
}
