import { FieldValue } from "firebase/firestore";
import React, { useState } from "react";

interface CategoryData {
  category: string;
  uid: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

interface CategorySelect {
  category: string;
  setCategory: (e: string) => void;
  categoryDataList: CategoryData[];
}

export const CategorySelect: React.FC<CategorySelect> = ({
  category,
  setCategory,
  categoryDataList,
}) => {
  const option = categoryDataList.map((data, index) => (
    <option key={index} value={data.category}>
      {data.category}
    </option>
  ));
  return (
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
        {option}
      </select>
    </div>
  );
};
