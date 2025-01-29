import { CategoryIndexList, IndexListTbody } from "../types";

const MoneyTypeIndexListTbody = <T extends CategoryIndexList>({
  tbodyList,
  handleEdit,
  handleDelete,
}: IndexListTbody<T>) => {
  return (
    <tbody>
      {tbodyList.map((tbodyData, index) => (
        <tr key={index} className="border-t hover:bg-indigo-100 transition">
          <td className="p-4 whitespace-nowrap text-gray-800 flex-grow">
            {tbodyData.data.name}
          </td>
          <td className="p-4 flex space-x-1">
            {/* 編集ボタン */}
            <button
              onClick={() => handleEdit(tbodyData.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 3l4 4m0 0l-10 10L3 19l2-8 10-10z"
                />
              </svg>
              <span>編集</span>
            </button>
            {/* 削除ボタン */}
            <button
              onClick={() => handleDelete(tbodyData.id, tbodyData)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>削除</span>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default MoneyTypeIndexListTbody;
