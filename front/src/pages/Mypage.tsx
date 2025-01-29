import { useNavigate } from "react-router-dom";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { FiUsers } from "react-icons/fi";
import { AiOutlineCopy, AiOutlineFolderAdd } from "react-icons/ai";
import Header from "../components/Header";
import { useContext, useEffect, useState } from "react";
import Alert from "../components/Alert";
import { UserContext } from "../contexts/UserContextProvider";
import { getData } from "../firebase/firestore";
import { FUser } from "../types";

export default function Mypage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  useEffect(() => {
    const initialProcessing = async () => {
      console.log(userContext?.user);
      if (userContext?.user) {
        const userData = await getData<FUser>("users", {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
        userContext?.setUserData(userData[0]);
      }
    };
    initialProcessing();
  }, []);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleCopy = () => {
    if (userContext?.userData) {
      navigator.clipboard
        .writeText(userContext.userData.fid)
        .then(() => {
          setAlertMessage("フレンドIDをコピーしました！");
          setAlertType("success");
        })
        .catch(() => {
          setAlertMessage("コピーに失敗しました。");
          setAlertType("error");
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダーセクション */}
      <Header title={"マイページ"} />

      {/* アラート */}
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center space-y-6 bg-gray-100 flex-1 py-8">
        {/* フレンドID表示 */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-lg font-medium text-gray-700">フレンドID</div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded shadow-md">
            <span className="text-gray-800 font-mono">
              {userContext?.userData?.fid}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <AiOutlineCopy size={20} />
            </button>
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* メンバー作成ボタン */}
          <button
            onClick={() => navigate("/group")}
            className="flex items-center justify-center w-48 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
          >
            <FiUsers className="mr-2" size={20} />
            グループ管理
          </button>

          {/* カテゴリ一覧画面遷移ボタン */}
          <button
            onClick={() => navigate("/spending-summary")}
            className="flex items-center justify-center w-48 px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
          >
            <AiOutlineFolderAdd className="mr-2" size={20} />
            カテゴリ一覧
          </button>
        </div>
      </main>

      {/* カスタムボトムナビゲーション */}
      <footer className="w-full mt-auto">
        <CustomBottomNavigation />
      </footer>
    </div>
  );
}
