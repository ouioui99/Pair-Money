import dayjs from "dayjs";
import {
  CommonResponseData,
  SpendingResponse,
  SpendingIndexList,
  FUser,
} from "../types";
import { convertIdToName } from "../util/commonFunc";
import { FaCalendarAlt, FaUser, FaTags } from "react-icons/fa";

export interface IndexListTbody<T> {
  tbodyList: T[];
  selectedItems: SpendingIndexList[];
  handleCheckboxChange: (spendingData: SpendingIndexList) => void;
  groupMemberDataList?: FUser[];
  forDisplayCategoryDataList?: { id: string; name: string }[];
}

export default function SpendingIndexListMobile<
  T extends CommonResponseData<SpendingResponse>
>({
  tbodyList,
  selectedItems,
  handleCheckboxChange,
  groupMemberDataList,
  forDisplayCategoryDataList,
}: IndexListTbody<T>) {
  return (
    <div className="block md:hidden">
      <div className="max-w-3xl mx-auto bg-gray-50 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">経費一覧</h1>
        <ul className="space-y-2">
          {tbodyList.map((spendingData) => (
            <li
              key={spendingData.id}
              className="bg-white rounded-lg shadow p-4 flex items-center"
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-semibold text-gray-800">
                    ¥{Number(spendingData.data.amount).toLocaleString()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      spendingData.data.commonAccountPaid
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {spendingData.data.commonAccountPaid
                      ? "共通口座"
                      : "個人口座"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    {dayjs(spendingData.data.date.toDate()).format(
                      "YYYY-MM-DD"
                    )}
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    {convertIdToName(
                      spendingData.data.payerUid,
                      "uid",
                      "name",
                      groupMemberDataList
                    )}
                  </div>
                  <div className="flex items-center">
                    <FaTags className="mr-2" />
                    {convertIdToName(
                      spendingData.data.categoryId,
                      "id",
                      "name",
                      forDisplayCategoryDataList
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4 self-center">
                <input
                  type="checkbox"
                  checked={selectedItems.some(
                    (item) => item.id === spendingData.id
                  )}
                  onChange={() => handleCheckboxChange(spendingData)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
