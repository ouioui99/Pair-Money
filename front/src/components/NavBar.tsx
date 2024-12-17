import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  memberName: string;
}

type HeaderProps = {
  username: string;
  onLogout: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ memberName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    //onLogout();
    navigate("/login"); // ログイン画面に遷移
  };

  const goToUserSelection = () => {
    navigate("/user-selection"); // ユーザー選択画面に遷移
  };
  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* ロゴ */}
        <div className="text-lg font-bold">MyApp</div>

        {/* ユーザー名 */}
        <div className="hidden md:block">
          <span className="mr-4">こんにちは、{memberName}さん</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            ログアウト
          </button>
        </div>

        {/* ハンバーガーメニューアイコン */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* ハンバーガーメニュー内容 */}
      {menuOpen && (
        <div className="bg-blue-600 text-white md:hidden">
          <div className="p-4">
            <p className="mb-4">こんにちは、{memberName}さん</p>
            <button
              onClick={goToUserSelection}
              className="block w-full text-left px-4 py-2 mb-2 bg-blue-500 hover:bg-blue-700 rounded"
            >
              ユーザー選択画面へ
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
