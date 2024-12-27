import React, { useEffect, useState } from "react";

// アラートのタイプ（成功・エラー）
type AlertType = "success" | "error";

// アラートのコンポーネント
interface AlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const alertClasses = type === "success" ? "bg-green-500" : "bg-red-500";

  // アラートが表示される際にフェードインし、5秒後にフェードアウトするためのクラス
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // 5秒後に非表示にする
    }, 5000); // 5秒後に非表示

    return () => clearTimeout(timer); // クリーンアップ
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-md text-white rounded shadow-lg ${alertClasses} 
        transition-all duration-1000 ease-out opacity-${
          isVisible ? "100" : "0"
        } scale-${isVisible ? "100" : "95"} 
        ${isVisible ? "" : "pointer-events-none"}`} // フェードイン・フェードアウト
    >
      <div className="flex items-center">
        <div className="flex-1">{message}</div>
        <button onClick={onClose} className="ml-4 text-xl hover:text-gray-200">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
