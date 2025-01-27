import { useContext, useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { UserContext } from "../contexts/UserContextProvider";
import { createData, realtimeGetter } from "../firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import {
  CommonResponseData,
  CreateSpendingRequest,
  GroupResponse,
  SpendingFormValue,
} from "../types";
import Alert from "../components/Alert";
import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const { addListener } = useFirestoreListeners();
  const [group, setGroup] = useState<CommonResponseData<GroupResponse>[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態

  const handleOnSubmit = async (data: SpendingFormValue) => {
    if (userContext?.user?.uid) {
      const spendingFormValue: CreateSpendingRequest = {
        amount: data.amount,
        date: data.date.toDate(),
        categoryId: data.categoryId,
        payerUid: data.payerUid,
        groupId: group[0].id,
        uid: userContext.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await createData("spendings", spendingFormValue);
        setAlert({
          message: "支出の作成が成功しました！",
          type: "success",
        });
      } catch (error) {
        console.error("支出作成に失敗しました", error);
        setAlert({
          message: "支出の作成に失敗しました。再試行してください。",
          type: "error",
        });
      }
    } else {
      console.log("ユーザーIDがありません");
      setAlert({
        message: "ログイン状態を確認してください。",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        setIsLoading(true); // ローディング開始
        const unsubscribeGroups = realtimeGetter(
          "groups",
          setGroup,

          {
            subDoc: "memberUids",
            is: "array-contains",
            subDocCondition: userContext.user.uid,
          },
          setIsLoading // ローディング状態管理用
        );

        addListener(unsubscribeGroups);
      }
    };

    initialProcessing();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={"ホーム"} />

      <div className="flex-1 flex items-start justify-center bg-gray-100 pt-10">
        <div className="w-full max-w-lg">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          {isLoading ? (
            // カスタムローディング画面
            <div className="flex flex-col items-center justify-center h-96">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <p className="mt-4 text-lg text-gray-700 font-semibold">
                グループデータを読み込んでいます...
              </p>
            </div>
          ) : group.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-700 text-lg font-semibold mb-4">
                グループデータがありません。
              </p>
              <button
                onClick={() => navigate("/group")}
                className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                グループを作成する
              </button>
            </div>
          ) : (
            <ExpenseForm
              onSubmit={handleOnSubmit}
              spendingInitialValues={undefined}
              group={group}
            />
          )}
        </div>
        <CustomBottomNavigation />
      </div>
    </div>
  );
}
