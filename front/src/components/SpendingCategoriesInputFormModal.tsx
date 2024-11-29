import React, { useState } from "react";

type FixedCostsForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string }) => void;
};

const SpendingCategoriesInputFormModal: React.FC<FixedCostsForm> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onSubmit({ category });
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
      <div className="max-w-lg mx-auto p-8 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="category"
              className="block text-gray-800 font-semibold mb-2 text-lg"
            >
              支出カテゴリー
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition placeholder-gray-400 text-lg"
              placeholder="例: 光熱費"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-8 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            登録
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-8 text-lg font-semibold text-gray-600 bg-gray-200 rounded-xl shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpendingCategoriesInputFormModal;
