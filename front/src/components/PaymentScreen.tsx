import React from "react";
import {
  CommonResponseData,
  MemberIndexList,
  SpendingResponse,
} from "../types";
import {
  calculateAllMembersTotalPaid,
  calculateTotalPaidByPerson,
} from "../util/calculateUtils";

interface Payment {
  payer: string; // 支払う人
  receiver: string; // 受け取る人
  amount: number; // 金額
}

interface PaymentScreenProps {
  spendingDataList: CommonResponseData<SpendingResponse>[];
  membersDataList: MemberIndexList[];
  payments: Payment[]; // 支払いリスト
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  spendingDataList,
  membersDataList,
  payments,
}) => {
  // メンバーの名前をリストに格納
  const memberNames = membersDataList.map((member) => member.data.name);

  // 支払額を集計する
  const totalPaidByPerson = calculateTotalPaidByPerson(spendingDataList);

  // メンバーリストのすべてのメンバーを含める（支払額がないメンバーには0を設定）
  const allMembersTotalPaid = calculateAllMembersTotalPaid(
    totalPaidByPerson,
    memberNames
  );

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
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