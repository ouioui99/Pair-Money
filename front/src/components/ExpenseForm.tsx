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

  const [commonAccountPaid, setCommonAccountPaid] = useState<boolean>(false);

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

  const [dateError, setDateError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [payerUidError, setPayerUidError] = useState<string | null>(null);
  const [categoryIdError, setCategoryIdError] = useState<string | null>(null);

  const validateInputs = () => {
    let isValid = true;

    if (!date) {
      setDateError("日付を入力してください");
      isValid = false;
    } else {
      setDateError(null);
    }

    if (!amount || parseInt(amount) <= 0) {
      setAmountError("有効な金額を入力してください");
      isValid = false;
    } else {
      setAmountError(null);
    }

    if (!payerUid) {
      setPayerUidError("清算者を選択してください");
      isValid = false;
    } else {
      setPayerUidError(null);
    }

    if (!categoryId) {
      setCategoryIdError("カテゴリーを選択してください");
      isValid = false;
    } else {
      setCategoryIdError(null);
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInputs() && amount && date && categoryId) {
      onSubmit({
        amount,
        date,
        categoryId,
        payerUid,
        commonAccountPaid,
      });
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
      className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {spendingInitialValues ? "支出編集" : "支出登録"}
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            日付
          </label>
          <input
            type="date"
            id="date"
            value={date.format("YYYY-MM-DD")}
            onChange={(e) => setDate(dayjs(e.target.value))}
            className={`w-full p-3 border ${
              dateError ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
          />
          {dateError && (
            <p className="text-red-500 text-sm mt-1">{dateError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            金額
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value || "")}
            className={`w-full p-3 border ${
              amountError ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
            placeholder="例: 1000"
          />
          {amountError && (
            <p className="text-red-500 text-sm mt-1">{amountError}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="commonAccountPaid"
            checked={commonAccountPaid}
            onChange={(e) => setCommonAccountPaid(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="commonAccountPaid"
            className="ml-2 block text-sm text-gray-700"
          >
            共通口座からの支払い
          </label>
        </div>

        <MemberSelect
          payerUid={payerUid}
          setPayerUid={setPayerUid}
          groupMemberDataList={groupMemberDataList}
          commonAccountPaid={commonAccountPaid}
          error={payerUidError}
        />

        <CategorySelect
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          categoryDataList={categoryDataList}
          error={categoryIdError}
        />
      </div>

      <div className="space-y-4 pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          登録
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          カメラでレシートを読み込む
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
