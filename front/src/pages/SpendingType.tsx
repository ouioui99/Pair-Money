import React, { useContext, useEffect, useState } from "react";
import MoneyTypeIndexList from "../components/MoneyTypeIndexList";
import SpendingCategoriesInputForm from "../components/SpendingCategoriesInputForm";
import { getData, insertData, realtimeGetter } from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";

interface Data {
  category: string;
}

interface CategoryData {
  category: string;
  uid: string;
}

export default function SpendingCategory() {
  const userContext = useContext(UserContext);
  const [categoryDataList, setCategoryDataList] = useState<CategoryData[]>([]);
  const handleOnSubmit = (data: Data) => {
    if (userContext?.user?.uid) {
      const categoryInputValue: CategoryData = {
        category: data.category,
        uid: userContext.user.uid,
      };

      insertData("spendingCategories", categoryInputValue);
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
  };
  const handleEdit = (index: number) => {
    console.log(index);
  };

  const handleDelete = (index: number) => {
    console.log(index);
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        realtimeGetter("spendingCategories", setCategoryDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
      }
    };
    initialProcessing();
  }, []);

  return (
    <>
      <div className="font-bold text-gray-700 flex flex-col items-center justify-start">
        <div className="w-full max-w-lg">
          <div className="w-full p-1">
            <h1 className="text-2xl font-bold text-center mb-6">
              支出カテゴリー管理
            </h1>
            <div className="sticky top-0 z-10 w-full rounded-md">
              <SpendingCategoriesInputForm onSubmit={handleOnSubmit} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-1 rounded-md">
        <MoneyTypeIndexList
          fixedCosts={categoryDataList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        ></MoneyTypeIndexList>
      </div>
    </>
  );
}
