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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    // アラートを表示する
    setIsVisible(true);

    // 4.5秒後にフェードアウト開始
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    // 5秒後にコンポーネントを閉じる
    const closeTimer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-16 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-md text-white rounded shadow-lg ${alertClasses} 
    transition-all duration-500 ease-out ${
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}
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
