import React, { useState } from "react";
import { CategoryIndexList, FixedCostFormValue, FixedCostList } from "../types";

type FixedCostsForm = {
  onSubmit: (data: FixedCostFormValue) => void;
  initialValues?: FixedCostList;
  categoryDataList: CategoryIndexList[];
};

const FixedCostsInputForm: React.FC<FixedCostsForm> = ({
  onSubmit,
  initialValues,
  categoryDataList,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && category) {
      onSubmit({ title: title, amount: amount, category: category });
      setAmount("");
      setCategory("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="amount"
          className="block text-gray-700 font-medium mb-2"
        >
          タイトル
        </label>
        <input
          type="number"
          id="amount"
          value={title}
          onChange={(e) => setTitle(e.target.value || "")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="例: 光熱費"
          required
        />
      </div>
      <div className="mb-4">
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
    </form>
  );
};

export default FixedCostsInputForm;
