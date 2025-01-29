import React from "react";
import { FUser } from "../types";

interface MemberSelect {
  payerUid: string;
  setPayerUid: (e: string) => void;
  groupMemberDataList: FUser[];
  commonAccountPaid?: boolean;
}

export const MemberSelect: React.FC<MemberSelect> = ({
  payerUid,
  setPayerUid,
  groupMemberDataList,
  commonAccountPaid,
}) => {
  const option = groupMemberDataList.map((data, index) => (
    <option key={index} value={data.uid}>
      {data.name}
    </option>
  ));

  return (
    <div className="mb-4">
      <label
        htmlFor="payerUid"
        className="block text-gray-700 font-medium mb-2"
      >
        支払ったメンバー
      </label>
      {commonAccountPaid ? (
        <div className="w-full p-2 h-10 border border-gray-300 bg-gray-100 text-gray-500 rounded-md flex items-center cursor-not-allowed">
          共通口座での支払い
        </div>
      ) : (
        <select
          id="payerUid"
          value={payerUid}
          onChange={(e) => setPayerUid(e.target.value)}
          className="w-full p-2 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required={!commonAccountPaid}
        >
          {option}
        </select>
      )}
    </div>
  );
};
