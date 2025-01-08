import { useContext } from "react";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/api/user/user";
import { UserContext } from "../contexts/UserContextProvider";
import { headerProp } from "../types";

const Header = ({ title, onClick }: headerProp) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
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
    <header className="p-4 border-b flex items-center justify-between gap-4 flex-nowrap">
      <h1 className="text-lg font-semibold truncate">{title}</h1>
      <div className="flex gap-2 flex-nowrap">
        {onClick && (
          <button
            className="flex items-center bg-green-500 text-white px-3 py-1.5 text-sm rounded hover:bg-green-600 focus:outline-none"
            onClick={onClick}
          >
            <FiPlus className="mr-1" />
            新規作成
          </button>
        )}
        <button
          className="flex items-center bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600 focus:outline-none"
          onClick={handleLogout}
        >
          <FiLogOut className="mr-1" />
          ログアウト
        </button>
      </div>
    </header>
  );
};

export default Header;
