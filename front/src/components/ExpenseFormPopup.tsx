import { useState, ChangeEvent, FormEvent } from "react";

// フォームデータの型定義
interface FormData {
  amount: string;
  date: string;
  category: string;
}

function ExpenseFormPopup() {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    date: "",
    category: "",
  });

  // ポップアップの表示・非表示の状態
  const [isOpen, setIsOpen] = useState(false);

  // フォーム入力を管理
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // フォーム送信を処理
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // データ送信処理
    setIsOpen(false); // 送信後にポップアップを閉じる
  };

  // ポップアップを開く
  const openPopup = () => {
    setIsOpen(true);
  };

  // ポップアップを閉じる
  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* ポップアップを開くボタン */}
      <button
        onClick={openPopup}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Open Expense Form
      </button>

      {/* ポップアップウィンドウ */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Expense Form</h2>
            <form onSubmit={handleSubmit}>
              {/* Amount Input */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              {/* Date Input */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Input */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="category"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseFormPopup;
