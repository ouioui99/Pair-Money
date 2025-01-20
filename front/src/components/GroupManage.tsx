import React, { useContext, useEffect, useState } from "react";
import { CommonResponseData, FUser, GroupResponse, Member } from "../types";
import { UserContext } from "../contexts/UserContextProvider";
import { getData } from "../firebase/firestore";

interface GroupManegeProps {
  group: CommonResponseData<GroupResponse>[];
}

const GroupManage: React.FC<GroupManegeProps> = ({ group }) => {
  const userContext = useContext(UserContext);
  const [members, setMembers] = useState<FUser[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        const groupMemberUidList = group[0].data.memberUids;

        for (let index = 0; index < groupMemberUidList.length; index++) {
          const groupMemberUid = groupMemberUidList[index];

          const userData = await getData<FUser>("users", {
            subDoc: "uid",
            is: "==",
            subDocCondition: groupMemberUid,
          });
          setMembers([...members, userData[0]]);
        }
      }
    };
    initialProcessing();
  }, [group]);

  const handleDelete = (id: string) => {};

  const confirmDelete = () => {
    if (selectedMember) {
      setMembers((prev) =>
        prev.filter((member) => member.name !== selectedMember.uid)
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
                  onClick={() => handleDelete(member.uid)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  グループから削除
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
                onClick={() => handleDelete(member.uid)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

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
