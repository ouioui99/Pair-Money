import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FixedCostsInputForm from "../components/FixedCostsInputForm";
import ExpenseFormPopup from "../components/ExpenseFormPopup";
import ExpenseForm from "../components/ExpenseForm";
import IndexList from "../components/IndexList";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { UserContext } from "../contexts/UserContextProvider";
import { realtimeGetter } from "../firebase/firestore";
import { FieldValue } from "firebase/firestore";

interface CategoryData {
  data: {
    category: string;
    uid: string;
    createdAt: FieldValue;
    updatedAt: FieldValue;
  };
  id: string;
}

export default function Home() {
  const userContext = useContext(UserContext);
  const [categoryDataList, setCategoryDataList] = useState<CategoryData[]>([]);
  const handleOnSubmit = (data: {
    amount: number;
    date: string;
    category: string;
  }) => {
    console.log(data);
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

  const location = useLocation();
  const { totalAmount } = location.state || {}; // stateが存在しない場合を考慮

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">ホーム画面</h1>

        <ExpenseForm
          onSubmit={handleOnSubmit}
          totalAmount={totalAmount}
          categoryDataList={categoryDataList}
        />
      </div>
      <CustomBottomNavigation />
    </div>
  );
}
