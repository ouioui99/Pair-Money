import React, { useState } from "react";

type FixedCostsForm = {
  onSubmit: (data: { category: string }) => void;
};

const SpendingCategoriesInputForm: React.FC<FixedCostsForm> = ({
  onSubmit,
}) => {
  const [category, setCategory] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      onSubmit({ category });
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
          htmlFor="category"
          className="block text-gray-700 font-medium mb-2"
        >
          カテゴリー
        </label>
        <input
          type="string"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="例: 光熱費"
          required
        />
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

export default SpendingCategoriesInputForm;
