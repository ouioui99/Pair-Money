import React, { useContext, useState } from "react";
import TextFormInput from "../components/TextFormInput";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import { singup } from "../firebase/api/user/user";
import { serverTimestamp } from "firebase/firestore";
import { createData } from "../firebase/firestore";
import { fnv1a32 } from "../util/commonFunc";
import dayjs from "dayjs";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    }); // Reset error messages

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "パスワードが一致しません",
      }));
      return;
    }

    if (userContext) {
      singup(email, password)
        .then((result) => {
          const hashedValue = fnv1a32(result.uid + dayjs().format());

          const user = {
            name: name,
            uid: result.uid,
            fid: hashedValue,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          };

          createData("users", user);

          userContext.setUser(result);
          navigate("/");
        })
        .catch((e) => {
          console.log(e);

          // Handle specific error codes
          switch (e.errorCode) {
            case "auth/email-already-in-use":
              setErrorMessages((prev) => ({
                ...prev,
                email: "指定したメールアドレスは登録済みです",
              }));
              break;
            case "auth/invalid-email":
              setErrorMessages((prev) => ({
                ...prev,
                email: "メールアドレスのフォーマットが正しくありません",
              }));
              break;
            case "auth/operation-not-allowed":
              setErrorMessages((prev) => ({
                ...prev,
                general:
                  "指定したメールアドレス・パスワードは現在使用できません",
              }));
              break;
            case "auth/weak-password":
              setErrorMessages((prev) => ({
                ...prev,
                password: "パスワードは6文字以上にしてください",
              }));
              break;
            default:
              setErrorMessages((prev) => ({
                ...prev,
                general: "サインアップに失敗しました。もう一度お試しください。",
              }));
              break;
          }
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">サインアップ</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              名前
            </label>
            <TextFormInput
              id="name"
              name="name"
              type="name"
              autoComplete="name"
              required={true}
              value={name}
              onChange={setName}
              error={!!errorMessages.name}
            />
            {errorMessages.name && (
              <p className="mt-1 text-sm text-red-500">{errorMessages.name}</p>
            )}
          </div>
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
              error={!!errorMessages.confirmPassword}
            />
            {errorMessages.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errorMessages.confirmPassword}
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
