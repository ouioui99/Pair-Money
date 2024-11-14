import React from "react";
import FixedCostsInputForm from "../components/FixedCostsInputForm";
import IndexList from "../components/IndexList";
import FixedCostsPage from "../components/FixedCostsInputForm";
import Test from "../components/Test";
import FixedCostsIndexList from "../components/FixedCostsIndexList";

export default function FixedCostsList() {
  const handleOnSubmit = (data: { amount: number; category: string }) => {
    console.log(data);
  };
  return (
    <div className="font-bold text-gray-700 min-h-screen flex flex-col items-center justify-start">
      <div className="w-full max-w-lg">
        <div className="w-full p-1">
          <h1 className="text-2xl font-bold text-center mb-6">固定費管理</h1>
          <div className="sticky top-0 bg-gray-100 z-10 w-full rounded-lg">
            <FixedCostsInputForm onSubmit={handleOnSubmit} />
          </div>
        </div>
        <div className="flex flex-col w-full p-1">
          <FixedCostsIndexList
            fixedCosts={[{ amount: 1000, category: "string" }]}
          ></FixedCostsIndexList>
        </div>
      </div>
    </div>
  );
}
