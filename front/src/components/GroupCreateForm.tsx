import React, { useState } from "react";

type GroupCreateFormProps = {
  handleGroupCreate: (groupName: string) => void;
};

const GroupCreateForm: React.FC<GroupCreateFormProps> = ({
  handleGroupCreate,
}) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() === "") {
      alert("グループ名を入力してください");
      return;
    }
    // グループ作成処理を実行
    handleGroupCreate(groupName);
    setGroupName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        グループ作成
      </h2>

      <div className="mb-4 font-bold">
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-gray-700 font-medium mb-2"
          >
            グループ名
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            placeholder="例: 家族グループ"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
      >
        作成
      </button>
    </form>
  );
};

export default GroupCreateForm;
