import { useContext, useEffect, useState } from "react";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import GroupCreateForm from "../components/GroupCreateForm";
import Header from "../components/Header";
import { createData, getData, realtimeGetter } from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import Alert from "../components/Alert";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";
import { GroupResponse } from "../types";
import GroupManage from "../components/GroupManage";
import MemberInviteForm from "../components/MemberInviteForm";

export default function Group() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();
  const [group, setGroup] = useState<GroupResponse[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [friendId, setFriendId] = useState("");
  const handleGroupCreate = async (groupName: string) => {
    if (userContext?.user?.uid) {
      const groupData = {
        name: groupName,
        members: { memberUid: userContext.user.uid, role: "1" },
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

  const handleCancelClick = () => {
    setFriendId("");
    setShowFormModal(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowFormModal(false);
    }
  };

  const handleOnSubmit = async (friendId: string) => {
    if (userContext?.user?.uid) {
      const userData = await getData("users", {
        subDoc: "fid",
        is: "==",
        subDocCondition: friendId,
      });
      return new Promise<any[]>((resolve) => {
        resolve(userData);
      });
    }
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        const unsubscribeSpendingCategories = realtimeGetter(
          "groups",
          setGroup,
          {
            subDoc: "members.memberUid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        addListener(unsubscribeSpendingCategories);
      }
    };
    initialProcessing();
  }, [addListener]);
  return (
    <div>
      <Header
        title={"グループ管理"}
        onClick={() => setShowFormModal(true)}
        buttonTitle="メンバー招待"
      ></Header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}
        </div>
      </div>

      {group.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <GroupCreateForm
              handleGroupCreate={handleGroupCreate}
            ></GroupCreateForm>
          </div>
        </div>
      ) : (
        <GroupManage></GroupManage>
      )}

      {showFormModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={handleBackgroundClick}
        >
          <MemberInviteForm
            isOpen={showFormModal}
            onClose={handleCancelClick}
            onSubmit={handleOnSubmit}
          />
        </div>
      ) : null}
      {/* カスタムボトムナビゲーション */}
      <footer className="w-full mt-auto">
        <CustomBottomNavigation />
      </footer>
    </div>
  );
}
