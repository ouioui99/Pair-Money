import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "確認",
  description = "本当に実行しますか？この操作は元に戻せません。",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 transform transition-all duration-300">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12.9a9 9 0 11-6.219-8.476"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
          {title}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">{description}</p>
        <div className="flex justify-between space-x-4">
          <button
            className="w-full py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="w-full py-2 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
