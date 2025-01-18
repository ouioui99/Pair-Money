import { useContext, useState } from "react";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import GroupCreateForm from "../components/GroupCreateForm";
import Header from "../components/Header";
import { createData } from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import Alert from "../components/Alert";

export default function Group() {
  const userContext = useContext(UserContext);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const handleGroupCreate = async (groupName: string) => {
    if (userContext?.user?.uid) {
      const groupData = {
        name: groupName,
        members: { memberUid: userContext.user.uid },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        await createData("groups", groupData);
        // 成功した場合のアラート
        setAlert({
          message: "グループ作成が成功しました！",
          type: "success",
        });
      } catch (error) {
        // 失敗した場合のアラート
        setAlert({
          message: "グループ作成に失敗しました。再試行してください。",
          type: "error",
        });
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header title={"グループ管理"}></Header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}
          <GroupCreateForm
            handleGroupCreate={handleGroupCreate}
          ></GroupCreateForm>
        </div>
      </div>

      {/* カスタムボトムナビゲーション */}
      <footer className="w-full mt-auto">
        <CustomBottomNavigation />
      </footer>
    </div>
  );
}
