import React, { useState } from "react";
import { MemberFormValue, MemberIndexList } from "../types";

type FixedCostsForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormValue) => void;
  initialValues?: MemberIndexList;
};

const MemberInputForm: React.FC<FixedCostsForm> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [memberName, setMembarName] = useState<string>(
    initialValues?.data.memberName || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberName) {
      onSubmit({ memberName: memberName });
      setMembarName("");
      onClose();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleBackgroundClick}
    >
      <div
        className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-2xl max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // 背景クリック時の閉じ動作を無効化
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          メンバー登録
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メンバー名入力 */}
          <div>
            <label
              htmlFor="memberName"
              className="block text-gray-800 font-medium mb-2 text-sm"
            >
              メンバー名
            </label>
            <input
              type="text"
              id="memberName"
              value={memberName}
              onChange={(e) => setMembarName(e.target.value || "")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-base"
              placeholder="例: 太郎"
              required
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-indigo-500 rounded-md shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            登録
          </button>

          {/* キャンセルボタン */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            キャンセル
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberInputForm;
