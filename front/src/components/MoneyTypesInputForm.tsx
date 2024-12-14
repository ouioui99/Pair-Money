import React, { useState } from "react";

// 使用種類の型を定義
interface ExamType {
  type: string;
}

const MoneyTypesInputForm: React.FC = () => {
  // 使用種類リストの状態を管理
  const [types, setTypes] = useState<ExamType[]>([]);
  // フォーム入力の状態を管理
  const [inputType, setInputType] = useState<string>("");

  // フォームの送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType.trim()) {
      // 新しい使用種類をリストに追加
      setTypes([...types, { type: inputType }]);
      // 入力フィールドをクリア
      setInputType("");
    }
  };

  return (
    <div className="min-h-screen min-w-full bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">使用金額種類画面</h2>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="type" className="block font-medium mb-2">
              Type:
            </label>
            <input
              type="text"
              id="type"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter type"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Type
          </button>
        </form>

        {/* Responsive Table */}
        <div className="overflow-hidden">
          <table className="min-w-full hidden md:table table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">Date</th>
              </tr>
            </thead>
            {/* 空の行を追加して間隔を作る */}
            <tbody>
              {types.map((examType, index) => (
                <tr key={index} className="border-t hover:bg-gray-200">
                  {/* ホバー時の色を設定 */}
                  <td className="p-4 whitespace-nowrap">{examType.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="block md:hidden">
            {types.map((examType, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-md" // ホバー時の色を設定
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Date:</span>
                  <span>{examType.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTypesInputForm;
