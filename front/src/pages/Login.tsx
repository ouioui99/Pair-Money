import React, { useContext, useState } from "react";
import TextFormInput from "../components/TextFormInput";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import { login } from "../firebase/api/user/user";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
    general: "",
  });
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages({ email: "", password: "", general: "" }); // Reset errors

    if (userContext) {
      login(email, password)
        .then((result) => {
          userContext.setUser(result);
          navigate("/");
        })
        .catch((error) => {
          // Handle error codes
          switch (error.errorCode) {
            case "auth/user-disabled":
              setErrorMessages((prev) => ({
                ...prev,
                email: "そのメールアドレスは利用できません",
              }));
              break;
            case "auth/invalid-email":
              setErrorMessages((prev) => ({
                ...prev,
                email: "メールアドレスのフォーマットが正しくありません",
              }));
              break;
            case "auth/user-not-found":
              setErrorMessages((prev) => ({
                ...prev,
                email: "ユーザーが見つかりません",
              }));
              break;
            case "auth/wrong-password":
              setErrorMessages((prev) => ({
                ...prev,
                password: "パスワードが違います",
              }));
              break;
            default:
              setErrorMessages((prev) => ({
                ...prev,
                general: "ログインに失敗しました。もう一度お試しください。",
              }));
              break;
          }
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">ログイン</h2>
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
              error={!!errorMessages.email}
            />
            {errorMessages.email && (
              <p className="mt-1 text-sm text-red-500">{errorMessages.email}</p>
            )}
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
              error={!!errorMessages.password}
            />
            {errorMessages.password && (
              <p className="mt-1 text-sm text-red-500">
                {errorMessages.password}
              </p>
            )}
          </div>
          {errorMessages.general && (
            <p className="mt-1 text-sm text-red-500">{errorMessages.general}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログイン
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          アカウントをお持ちでないですか?
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-500">
            サインアップ
          </Link>
        </p>
      </div>
    </div>
  );
}
