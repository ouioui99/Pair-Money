import React from "react";
import { Link, useLocation } from "react-router-dom";
import FixedCostsInputForm from "../components/FixedCostsInputForm";
import ExpenseFormPopup from "../components/ExpenseFormPopup";
import ExpenseForm from "../components/ExpenseForm";
import IndexList from "../components/IndexList";
import CustomBottomNavigation from "../components/CustomBottomNavigation";

export default function Home() {
  const handleOnSubmit = (data: {
    amount: number;
    date: string;
    category: string;
  }) => {
    console.log(data);
  };

  const location = useLocation();
  const { totalAmount } = location.state || {}; // stateが存在しない場合を考慮

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">ホーム画面</h1>

        <ExpenseForm onSubmit={handleOnSubmit} totalAmount={totalAmount} />
      </div>
      <CustomBottomNavigation />
    </div>
  );
}
