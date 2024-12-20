import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FixedCostsInputForm from "../components/MemberInputForm";
import ExpenseFormPopup from "../components/ExpenseFormPopup";
import ExpenseForm from "../components/ExpenseForm";
import IndexList from "../components/IndexList";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { UserContext } from "../contexts/UserContextProvider";
import { insertData, realtimeGetter } from "../firebase/firestore";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import {
  CategoryIndexList,
  CategoryResponse,
  CreateSpendingRequest,
  MemberIndexList,
  SpendingFormValue,
} from "../types";

export default function Home() {
  const userContext = useContext(UserContext);
  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );
  const [membersDataList, setMemebersDataList] = useState<MemberIndexList[]>(
    []
  );
  const handleOnSubmit = (data: SpendingFormValue) => {
    console.log(data.date);

    if (userContext?.user?.uid) {
      const spendingFormValue: CreateSpendingRequest = {
        amount: data.amount,
        date: data.date.toDate(),
        member: data.member,
        category: data.category,
        uid: userContext.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      insertData("spendings", spendingFormValue);
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        realtimeGetter("spendingCategories", setCategoryDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
        realtimeGetter("members", setMemebersDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
      }
    };
    initialProcessing();
  }, []);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gray-100 overflow-hidden">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">ホーム画面</h1>

        <ExpenseForm
          onSubmit={handleOnSubmit}
          spendingInitialValues={undefined}
          categoryDataList={categoryDataList}
          memberDataList={membersDataList}
        />
      </div>
      <CustomBottomNavigation />
    </div>
  );
}
