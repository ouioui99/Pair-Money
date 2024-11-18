import React, { useContext, useState } from "react";
import TextFormInput from "../components/TextFormInput";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import { singup } from "../firebase/api/user/user";
import { insertData } from "../firebase/firestore";
import firebase from "firebase/compat/app";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userContext) {
      singup(email, password)
        .then((result) => {
          const user = {
            //name: result?.name,
            uid: result.uid,
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
          };

          insertData("users", user);

          userContext.setUser(result);
          navigate("/");
        })
        .catch((error) => {
          console.log(error.errorCode);
        });
    }
    e.preventDefault();
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">サインアップ</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <TextFormInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required={true}
              value={email}
              onChange={setEmail}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <TextFormInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required={true}
              value={password}
              onChange={setPassword}
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              パスワード確認
            </label>
            <TextFormInput
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required={true}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              サインアップ
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          既にアカウントをお持ちですか？
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
