import React from "react";
import { CategoryIndexList } from "../types";

interface CategorySelect {
  categoryId: string;
  setCategoryId: (e: string) => void;
  categoryDataList: CategoryIndexList[];
}

export const CategorySelect: React.FC<CategorySelect> = ({
  categoryId,
  setCategoryId,
  categoryDataList,
}) => {
  const option = categoryDataList.map((data, index) => (
    <option key={index} value={data.id}>
      {data.data.name}
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
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        required
      >
        {option}
      </select>
    </div>
  );
};
