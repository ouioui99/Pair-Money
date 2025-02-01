import React from "react";
import { CommonResponseData, FUser, SpendingResponse } from "../types";
import {
  calculateAllMembersTotalPaid,
  calculateCommonAccountTotal,
  calculateTotalPaidByPerson,
} from "../util/calculateUtils";
import dayjs from "dayjs";

interface Payment {
  payer: string; // 支払う人
  receiver: string; // 受け取る人
  amount: number; // 金額
}

interface PaymentScreenProps {
  spendingDataList: CommonResponseData<SpendingResponse>[];
  groupMemberDataList: FUser[];
  payments: Payment[]; // 支払いリスト
  selectMonth: string;
  setSelectMonth: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  spendingDataList,
  groupMemberDataList,
  payments,
  selectMonth,
  setSelectMonth,
}) => {
  // メンバーの名前をリストに格納
  const memberNames = groupMemberDataList.map((member) => member.name);

  // データのある月のみを抽出（重複を排除）
  const uniqueMonths = Array.from(
    new Set(
      spendingDataList.map((spendingData) => {
        const date = spendingData.data.date.toDate();
        return dayjs(date).format("YYYY-MM"); // "YYYY-MM"形式
      })
    )
  );

  const filteredSpendingDataList =
    selectMonth === "all"
      ? spendingDataList
      : spendingDataList.filter((spendingData) => {
          const date =
            spendingData.data.date instanceof Date
              ? spendingData.data.date
              : spendingData.data.date.toDate();
          const yearMonth = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          const selectedYearMonth = dayjs(selectMonth).format("YYYY-MM");

          return yearMonth === selectedYearMonth;
        });

  const totalPaidByPerson = calculateTotalPaidByPerson(
    groupMemberDataList,
    filteredSpendingDataList
  );

  // メンバーリストのすべてのメンバーを含める（支払額がないメンバーには0を設定）
  const allMembersTotalPaid = calculateAllMembersTotalPaid(
    totalPaidByPerson,
    memberNames
  );

  const commonAccountTotal = calculateCommonAccountTotal(spendingDataList);

  return (
    <div className="bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            家計簿清算
          </h1>

          {/* 清算月選択 */}
          <div className="mb-8">
            <label
              htmlFor="settlement-month"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              清算月を選択
            </label>
            <select
              id="settlement-month"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectMonth}
              onChange={(e) => setSelectMonth(e.target.value)}
            >
              <option value="all">全期間</option>
              {uniqueMonths.map((month) => {
                const [year, monthNum] = month.split("-");
                return (
                  <option key={month} value={month}>
                    {`${year}年${Number.parseInt(monthNum, 10)}月`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 支払い情報 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              支払い情報
            </h2>

            {0 < payments.length && (
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
                清算方法
              </h3>
            )}

            <ul className="space-y-4">
              {payments.map((payment, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-blue-600 text-xl font-medium">
                      {payment.payer}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-green-600 text-xl font-medium">
                      {payment.receiver}
                    </span>
                  </div>
                  <div className="ml-auto text-2xl font-semibold text-red-600">
                    ¥{payment.amount.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 共通口座支出合計 */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              共通口座支出合計
            </h3>
            <p className="text-center text-3xl font-bold text-blue-600">
              ¥{commonAccountTotal.toLocaleString()}
            </p>
            <p className="text-center text-lg font-medium text-gray-600 pt-2">
              一人当たり: ¥
              {Math.round(
                commonAccountTotal / groupMemberDataList.length
              ).toLocaleString()}
            </p>
          </div>

          {/* 各メンバー立替額合計 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              各メンバー立替額合計
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(allMembersTotalPaid).map(
                ([person, total], index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-indigo-600">
                        {person}
                      </span>
                      <span className="text-xl font-bold text-pink-600">
                        ¥{total.toLocaleString()}
                      </span>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
