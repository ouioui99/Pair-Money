import React from "react";
import { CommonResponseData, FUser, SpendingResponse } from "../types";
import {
  calculateAllMembersTotalPaid,
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

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
        {/* 清算月選択 */}
        <div className="mb-6">
          <label
            htmlFor="settlement-month"
            className="block text-gray-700 text-lg font-medium mb-2"
          >
            清算月を選択
          </label>
          <select
            id="settlement-month"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectMonth.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setSelectMonth(value === "all" ? "all" : value);
            }}
          >
            {/* 初期値: 全期間 */}
            <option value="all">全期間</option>
            {/* データのある月のみ表示 */}
            {uniqueMonths.map((month) => {
              const [year, monthNum] = month.split("-");
              return (
                <option key={month} value={month}>
                  {`${year}年${parseInt(monthNum, 10)}月`}
                </option>
              );
            })}
          </select>
        </div>

        {/* 支払い関係 */}
        <h2 className="text-3xl font-semibold mb-12 text-center text-gray-800">
          清算方法
        </h2>
        <ul className="space-y-8">
          {payments.map((payment, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              {/* 支払者 */}
              <div className="flex items-center space-x-4">
                <span className="text-blue-600 text-xl font-medium">
                  {payment.payer}
                </span>
              </div>

              {/* アイコンと矢印 */}
              <div className="flex items-center justify-center space-x-3 text-gray-500">
                <span className="text-2xl font-semibold">➔</span>
              </div>

              {/* 受取者 */}
              <div className="flex items-center space-x-4">
                <span className="text-green-600 text-xl font-medium">
                  {payment.receiver}
                </span>
              </div>

              {/* 金額 */}
              <div className="ml-auto text-2xl font-semibold text-red-600">
                ¥{payment.amount.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>

        {/* 各人の支払い合計 */}
        <h3 className="text-xl font-bold mt-8 mb-4 text-center">
          各メンバー支出額合計
        </h3>
        <ul className="space-y-2">
          {Object.entries(allMembersTotalPaid).map(([person, total], index) => (
            <li
              key={index}
              className="flex justify-between text-lg font-medium text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm"
            >
              <span className="text-indigo-600">{person}</span>
              <span className="text-pink-600 font-bold">
                ¥{total.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentScreen;
