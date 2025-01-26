import { useContext, useEffect, useState } from "react";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import GroupCreateForm from "../components/GroupCreateForm";
import Header from "../components/Header";
import {
  createDataReturnDocId,
  getData,
  realtimeGetter,
  seedingData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { arrayUnion, serverTimestamp } from "firebase/firestore";
import Alert from "../components/Alert";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";
import { CommonResponseData, FUser, GroupResponse } from "../types";
import GroupManage from "../components/GroupManage";
import MemberInviteForm from "../components/MemberInviteForm";

export default function Group() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();
  const [group, setGroup] = useState<CommonResponseData<GroupResponse>[]>([]);
  const [members, setMembers] = useState<FUser[]>([]);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const handleGroupCreate = async (groupName: string) => {
    if (userContext?.user?.uid) {
      const groupData = {
        name: groupName,
        memberUids: arrayUnion(userContext.user.uid),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        const groupRef = await createDataReturnDocId("groups", groupData);

        //seedingDataを作成したグループIDで実行
        seedingData(userContext.user.uid, groupRef.id);
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
            subDoc: "memberUids",
            is: "array-contains",
            subDocCondition: userContext.user.uid,
          }
        );

        addListener(unsubscribeSpendingCategories);
      }
    };
    initialProcessing();
  }, [addListener]);

  // group の変化を監視してローディングを終了する
  useEffect(() => {
    setIsLoading(false);
  }, [group]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">データを読み込み中です...</p>
      </div>
    );
  }

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
        <GroupManage
          group={group}
          members={members}
          setMembers={setMembers}
        ></GroupManage>
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
            group={group}
            members={members}
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
