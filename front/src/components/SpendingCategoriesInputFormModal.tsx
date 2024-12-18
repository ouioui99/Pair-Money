import React, { useState } from "react";
import { CommonResponseData, CategoryResponse } from "../types";

type FixedCostsForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string }) => void;
  category?: string;
  setCategory: React.Dispatch<string>;
};

const SpendingCategoriesInputFormModal: React.FC<FixedCostsForm> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  setCategory,
}) => {
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
      <div
        className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()} // 背景クリック時の閉じ動作を無効化
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          支出カテゴリー登録
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="category"
              className="block text-gray-800 font-medium mb-2 text-sm"
            >
              支出カテゴリー
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
              placeholder="例: 光熱費"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            登録
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-base font-semibold text-gray-600 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default SpendingCategoriesInputFormModal;
