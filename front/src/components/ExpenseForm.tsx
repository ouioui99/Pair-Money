import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategorySelect } from "./CategorySelect";
import {
  CategoryIndexList,
  CommonResponseData,
  FUser,
  GroupResponse,
  SpendingFormValue,
  SpendingIndexList,
} from "../types";
import { MemberSelect } from "./MemberSelect";
import dayjs, { Dayjs } from "dayjs";
import { getData, realtimeGetter } from "../firebase/firestore";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";
import { UserContext } from "../contexts/UserContextProvider";

type ExpenseFormProps = {
  onSubmit: (data: SpendingFormValue) => void;
  spendingInitialValues?: SpendingIndexList;
  group: CommonResponseData<GroupResponse>[];
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  spendingInitialValues,
  group,
}) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();

  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );

  const [groupMemberDataList, setGroupMemberDataList] = useState<FUser[]>([]);

  // transformResult.totalAmountが定義されていればその値を初期値とし、なければ空文字を設定
  const [amount, setAmount] = useState<string | "">(
    spendingInitialValues?.data.amount !== undefined
      ? spendingInitialValues?.data.amount
      : ""
  );
  const [date, setDate] = useState<Dayjs>(
    spendingInitialValues?.data.date
      ? dayjs(spendingInitialValues?.data.date.toDate()) // 初期値があれば day.js オブジェクトに変換
      : dayjs() // 今日の日付を初期値として設定
  ); // 初期状態として今日の日付を設定
  const [categoryId, setCategoryId] = useState<string>(
    spendingInitialValues?.data.categoryId !== undefined
      ? spendingInitialValues?.data.categoryId
      : ""
  );
  const [payerUid, setPayerUid] = useState<string>(
    spendingInitialValues?.data.payerUid !== undefined
      ? spendingInitialValues?.data.payerUid
      : ""
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount && date && categoryId && payerUid) {
      onSubmit({ amount, date, categoryId, payerUid });
      setAmount("");
      setDate(dayjs()); // フォーム送信後も日付を今日にリセット

      if (userContext?.userData) {
        setPayerUid(userContext?.userData?.uid);
      }

      if (0 < categoryDataList.length) {
        setCategoryId(categoryDataList[0].id);
      }
    }
  };

  // カメラを起動する処理
  const handleCameraClick = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/receipt-scanning");
  };

  useEffect(() => {
    const initialProcessing = async () => {
      const groupMemberUidList = group[0].data.memberUids;
      const userDataList = await Promise.all(
        groupMemberUidList.map((groupMemberUid) =>
          getData<FUser>("users", {
            subDoc: "uid",
            is: "==",
            subDocCondition: groupMemberUid,
          })
        )
      );
      const memberUserData = userDataList.map((userData) => userData[0]);
      setGroupMemberDataList(memberUserData);
    };
    initialProcessing();
  }, [group]);

  // categoryDataListが空でない場合に初期値を設定
  useEffect(() => {
    const initialProcessing = async () => {
      const unsubscribeSpendingCategories = realtimeGetter(
        "spendingCategories",
        setCategoryDataList,
        {
          subDoc: "groupId",
          is: "==",
          subDocCondition: group[0].id,
        }
      );

      addListener(unsubscribeSpendingCategories);
    };
    initialProcessing();
  }, [groupMemberDataList]);

  useEffect(() => {
    if (payerUid === "" && userContext?.userData) {
      setPayerUid(userContext?.userData?.uid);
    }

    if (categoryId === "" && 0 < categoryDataList.length) {
      setCategoryId(categoryDataList[0].id);
    }
  }, [groupMemberDataList]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {spendingInitialValues ? (
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          支出編集
        </h2>
      ) : (
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          支出登録
        </h2>
      )}
      <div className="mb-4 font-bold">
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-gray-700 font-medium mb-2"
          >
            日付
          </label>
          <input
            type="date"
            id="date"
            value={date.format("YYYY-MM-DD")}
            onChange={(e) => setDate(dayjs(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        <label
          htmlFor="amount"
          className="block text-gray-700 font-medium mb-2"
        >
          金額
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value || "")}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="例: 1000"
          required
        />
      </div>

      <MemberSelect
        payerUid={payerUid}
        setPayerUid={setPayerUid}
        groupMemberDataList={groupMemberDataList}
      ></MemberSelect>

      <CategorySelect
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        categoryDataList={categoryDataList}
      ></CategorySelect>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
      >
        登録
      </button>

      <button
        type="button"
        onClick={handleCameraClick}
        className="w-full mt-7 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
      >
        カメラでレシートを読み込む
      </button>
    </form>
  );
};

export default ExpenseForm;
