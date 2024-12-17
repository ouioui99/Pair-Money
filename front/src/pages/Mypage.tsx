import React, { useContext } from "react";
import { logout } from "../firebase/api/user/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import NavBar from "../components/NavBar";
import { FiLogOut, FiUserPlus } from "react-icons/fi";

export default function Mypage() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const handleLogout = () => {
    logout().then((result) => {
      if (result === "") {
        userContext?.setUser(null);
        navigate("/login");
      } else {
        console.log(result);
      }
    });
  };
  return (
    <div>
      {/* ヘッダーセクション */}
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">マイページ</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center flex-grow space-y-6 bg-gray-100 min-h-screen flex flex-col items-center">
        {/* ボタン群 */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md"
          >
            <FiUserPlus className="mr-2" />
            メンバー作成
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          >
            <FiLogOut className="mr-2" />
            ログアウト
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
