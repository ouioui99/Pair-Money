import React, { useContext } from "react";
import { logout } from "../firebase/api/user/user";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";

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
    <>
      <button
        onClick={() => handleLogout()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Click Me
      </button>
      <div>マイページ</div>
    </>
  );
}
