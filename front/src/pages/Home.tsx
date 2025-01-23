import { useContext, useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { UserContext } from "../contexts/UserContextProvider";
import { createData, realtimeGetter } from "../firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import {
  CategoryIndexList,
  CommonResponseData,
  CreateSpendingRequest,
  GroupResponse,
  MemberIndexList,
  SpendingFormValue,
} from "../types";
import Alert from "../components/Alert";
import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";

export default function Home() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();
  const [group, setGroup] = useState<CommonResponseData<GroupResponse>[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
        // 成功した場合のアラート
        setAlert({
          message: "支出の作成が成功しました！",
          type: "success",
        });
      } catch (error) {
        console.error("支出作成に失敗しました", error);
        // 失敗した場合のアラート
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
        const unsubscribeGroups = realtimeGetter("groups", setGroup, {
          subDoc: "memberUids",
          is: "array-contains",
          subDocCondition: userContext.user.uid,
        });

        addListener(unsubscribeGroups);
      }
    };
    initialProcessing();
  }, [addListener]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={"ホーム"}></Header>

      {/* メインコンテンツの部分を画面いっぱいに表示 */}
      <div className="flex-1 flex items-start justify-center bg-gray-100 pt-10">
        <div className="w-full max-w-lg">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          {group.length === 0 ? (
            <p>Loading group data...</p>
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
