import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TransformResult {
  totalAmount?: number;
  error?: { title: string; message: string };
}

type ExpenseFormProps = {
  onSubmit: (data: { amount: number; date: string; category: string }) => void;
  totalAmount?: number;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, totalAmount }) => {
  const navigate = useNavigate();

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  // transformResult.totalAmountが定義されていればその値を初期値とし、なければ空文字を設定
  const [amount, setAmount] = useState<number | "">(
    totalAmount !== undefined ? totalAmount : ""
  );
  const [date, setDate] = useState<string>(formattedToday); // 初期状態として今日の日付を設定
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && date && category) {
      onSubmit({ amount: Number(amount), date, category });
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
          onChange={(e) => setAmount(e.target.valueAsNumber || "")}
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

      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-gray-700 font-medium mb-2"
        >
          カテゴリー
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required
        >
          <option value="">選択してください</option>
          <option value="食費">食費</option>
          <option value="交通費">交通費</option>
          <option value="娯楽">娯楽</option>
          <option value="その他">その他</option>
        </select>
      </div>

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
