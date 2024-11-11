import React from "react";
import FixedCostsInputForm from "../components/FixedCostsInputForm";

export default function FixedCostsList() {
  const handleOnSubmit = (data: { amount: number; category: string }) => {
    console.log(data);
  };
  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">固定費画面</h1>
        <FixedCostsInputForm onSubmit={handleOnSubmit} />
      </div>
    </div>
  );
}
