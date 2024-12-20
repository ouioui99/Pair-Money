import React, { useState } from "react";

interface PaymentPerPersonProps {
  totalAmount: number;
  numPeople: number;
}

const PaymentPerPerson: React.FC<PaymentPerPersonProps> = ({
  totalAmount,
  numPeople,
}) => {
  // 一人当たりの金額を計算
  const amountPerPerson = numPeople > 0 ? totalAmount / numPeople : 0;

  return (
    <div className="flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          一人当たりの金額
        </h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 金額の表示 */}
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-500">
              {"￥"}
              {amountPerPerson.toLocaleString()}
            </p>
          </div>
          <hr className="w-full border-gray-300" />
          <div className="text-center">
            <p className="text-lg text-gray-600">合計金額:</p>
            <p className="text-2xl font-bold text-gray-800">
              {"￥"}
              {totalAmount.toLocaleString()}
            </p>
            <p className="text-lg text-gray-600">人数:</p>
            <p className="text-2xl font-bold text-gray-800">{numPeople} 人</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPerPerson;
