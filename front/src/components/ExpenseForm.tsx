import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategorySelect } from "./CategorySelect";
import { FieldValue } from "firebase/firestore";
import {
  CategoryIndexList,
  MemberIndexList,
  SpendingFormValue,
  SpendingIndexList,
} from "../types";
import { MemberSelect } from "./MemberSelect";

type ExpenseFormProps = {
  onSubmit: (data: SpendingFormValue) => void;
  spendingInitialValues?: SpendingIndexList;
  categoryDataList: CategoryIndexList[];
  memberDataList: MemberIndexList[];
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  spendingInitialValues,
  categoryDataList,
  memberDataList,
}) => {
  const navigate = useNavigate();

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // transformResult.totalAmountが定義されていればその値を初期値とし、なければ空文字を設定
  const [amount, setAmount] = useState<string | "">(
    spendingInitialValues?.data.amount !== undefined
      ? spendingInitialValues?.data.amount
      : ""
  );
  const [date, setDate] = useState<string>(
    spendingInitialValues?.data.date !== undefined
      ? spendingInitialValues?.data.date
      : formattedToday
  ); // 初期状態として今日の日付を設定
  const [category, setCategory] = useState<string>(
    spendingInitialValues?.data.category !== undefined
      ? spendingInitialValues?.data.category
      : ""
  );
  const [member, setMember] = useState<string>(
    spendingInitialValues?.data.member !== undefined
      ? spendingInitialValues?.data.member
      : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount && date && category) {
      onSubmit({ amount, date, category, member });
      setAmount("");
      setDate(formattedToday); // フォーム送信後も日付を今日にリセット
      setCategory("");
    }
  };

  // カメラを起動する処理
  const handleCameraClick = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/receipt-scanning");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4 font-bold">
        <label
          htmlFor="amount"
          className="block text-gray-700 font-medium mb-2"
        >
          金額
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value || "")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="例: 1000"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
          日付
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
      </div>

      <MemberSelect
        member={member}
        setMember={setMember}
        memberDataList={memberDataList}
      ></MemberSelect>

      <CategorySelect
        category={category}
        setCategory={setCategory}
        categoryDataList={categoryDataList}
      ></CategorySelect>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
      >
        登録
      </button>

      <button
        type="button"
        onClick={handleCameraClick}
        className="w-full mt-7 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
      >
        カメラでレシートを読み込む
      </button>
    </form>
  );
};

export default ExpenseForm;
