import React, { useState } from "react";
import {
  CategoryIndexList,
  FixedCostFormValue,
  FixedCostIndexList,
} from "../types";

type FixedCostsForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FixedCostFormValue) => void;
  initialValues?: FixedCostIndexList;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && category) {
      onSubmit({ amount: amount, category: category });
      setAmount("");
      setCategory("");
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
      <div
        className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-2xl max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // 背景クリック時の閉じ動作を無効化
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          金額登録
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 金額入力 */}
          <div>
            <label
              htmlFor="amount"
              className="block text-gray-800 font-medium mb-2 text-sm"
            >
              金額
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value || "")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-base"
              placeholder="例: 1000"
              required
            />
          </div>

          {/* カテゴリー選択 */}
          <div>
            <label
              htmlFor="category"
              className="block text-gray-800 font-medium mb-2 text-sm"
            >
              カテゴリー
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-base"
              required
            >
              <option value="">選択してください</option>
              {categoryDataList.map((item) => (
                <option key={item.id} value={item.data.name}>
                  {item.data.name}
                </option>
              ))}
            </select>
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-indigo-500 rounded-md shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            登録
          </button>

          {/* キャンセルボタン */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default FixedCostsInputForm;
