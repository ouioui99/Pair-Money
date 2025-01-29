import { IndexListTbody, MemberIndexList } from "../types";

const MemberIndexListTBody = <T extends MemberIndexList>({
  tbodyList,
  handleEdit,
  handleDelete,
}: IndexListTbody<T>) => {
  return (
    <tbody>
      {tbodyList.map((membersData, index) => (
        <tr key={index} className="border-t hover:bg-gray-200">
          <td className="p-4">{membersData.data.name}</td>
          <td className="p-4">
            {/* 編集ボタン */}
            <button
              onClick={() => handleEdit(membersData.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
            >
              編集
            </button>
            {/* 削除ボタン */}
            <button
              onClick={() => handleDelete(membersData.id, membersData)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              削除
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default MemberIndexListTBody;
