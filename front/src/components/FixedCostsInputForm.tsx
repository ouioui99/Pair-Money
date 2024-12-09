import React, { useState } from "react";
import { CategoryIndexList, FixedCostFormValue, FixedCostList } from "../types";

type FixedCostsForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FixedCostFormValue) => void;
  initialValues?: FixedCostList;
  categoryDataList: CategoryIndexList[];
};

const FixedCostsInputForm: React.FC<FixedCostsForm> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  categoryDataList,
}) => {
  const [amount, setAmount] = useState<string>(
    initialValues?.data.amount || ""
  );
  const [category, setCategory] = useState<string>(
    initialValues?.data.category || ""
  );
  const [title, setTitle] = useState<string>(initialValues?.data.title || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && category) {
      onSubmit({ title: title, amount: amount, category: category });
      setAmount("");
      setCategory("");
      setTitle("");
      onClose();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-xl max-h-[80vh] overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="amount"
              className="block text-gray-800 font-medium mb-1 text-base"
            >
              金額
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value || "")}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
              placeholder="例: 1000"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-800 font-medium mb-1 text-base"
            >
              カテゴリー
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
              required
            >
              <option value="">選択してください</option>
              {categoryDataList.map((item) => (
                <option key={item.id} value={item.data.category}>
                  {item.data.category}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-base font-medium text-white bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            登録
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-base font-medium text-gray-600 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default FixedCostsInputForm;
