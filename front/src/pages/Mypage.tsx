import { useContext } from "react";
import { logout } from "../firebase/api/user/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import { AiOutlineEdit, AiOutlineFolderAdd } from "react-icons/ai";
import Header from "../components/Header";

export default function Mypage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ヘッダーセクション */}
      <Header title={"マイページ"}></Header>

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center space-y-6 bg-gray-100 min-h-screen py-8">
        {/* ボタン群 */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* メンバー作成ボタン */}
          <button
            onClick={() => navigate("/member-list")}
            className="flex items-center justify-center w-48 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
          >
            <FiUserPlus className="mr-2" size={20} />
            メンバー一覧
          </button>

          {/* 固定費一覧画面遷移ボタン */}
          <button
            onClick={() => navigate("/fixed-costs-list")}
            className="flex items-center justify-center w-48 px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md"
          >
            <AiOutlineEdit className="mr-2" size={20} />
            固定費一覧
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
