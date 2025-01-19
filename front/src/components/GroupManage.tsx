import React, { useState } from "react";

interface Member {
  id: string;
  name: string;
}

const GroupManage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleEdit = (id: string) => {
    const memberToEdit = members.find((member) => member.id === id);
    if (memberToEdit) {
      setSelectedMember(memberToEdit);
      setShowFormModal(true);
    }
  };

  const handleDelete = (id: string) => {
    const memberToDelete = members.find((member) => member.id === id);
    if (memberToDelete) {
      setSelectedMember(memberToDelete);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    if (selectedMember) {
      setMembers((prev) =>
        prev.filter((member) => member.id !== selectedMember.id)
      );
      setShowDeleteModal(false);
      setSelectedMember(null);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <table className="min-w-full hidden md:table table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 text-left font-semibold text-gray-700">
              メンバー名
            </th>
            <th className="p-4 text-left font-semibold text-gray-700">操作</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index} className="border-t hover:bg-gray-200">
              <td className="p-4 text-gray-800">{member.name}</td>
              <td className="p-4">
                <button
                  onClick={() => handleEdit(member.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="block md:hidden">
        {members.map((member, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl mb-6 transition-all duration-300 ease-in-out"
          >
            <div className="flex justify-between mb-3">
              <span className="font-medium text-gray-700 text-lg">
                メンバー名
              </span>
              <span className="text-xl font-semibold text-gray-900">
                {member.name}
              </span>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => handleEdit(member.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {showFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setShowFormModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">メンバー編集</h2>
            <form>
              <input
                type="text"
                className="border p-2 w-full rounded mb-4"
                defaultValue={selectedMember?.name}
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowFormModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              このメンバーを削除しますか？
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              「{selectedMember?.name}」を削除すると元に戻せません。
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                キャンセル
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManage;
