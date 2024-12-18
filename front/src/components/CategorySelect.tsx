import { FieldValue } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { CategoryResponse } from "../types";

interface CategorySelect {
  category: string;
  setCategory: (e: string) => void;
  categoryDataList: { data: CategoryResponse; id: string }[];
}

export const CategorySelect: React.FC<CategorySelect> = ({
  category,
  setCategory,
  categoryDataList,
}) => {
  // categoryDataListが空でない場合に初期値を設定
  useEffect(() => {
    if (categoryDataList.length > 0 && category === "") {
      setCategory(categoryDataList[0].data.category);
    } else {
      setCategory(category);
    }
  }, [categoryDataList, setCategory]);

  const option = categoryDataList.map((data, index) => (
    <option key={index} value={data.data.category}>
      {data.data.category}
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
