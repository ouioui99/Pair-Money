import React, { useEffect } from "react";
import { MemberIndexList } from "../types";

interface MemberSelect {
  member: string;
  setMember: (e: string) => void;
  memberDataList: MemberIndexList[];
}

export const MemberSelect: React.FC<MemberSelect> = ({
  member,
  setMember,
  memberDataList,
}) => {
  // memberDataListが空でない場合に初期値を設定
  useEffect(() => {
    if (memberDataList.length > 0 && member === "") {
      setMember(memberDataList[0].data.name);
    } else {
      setMember(member);
    }
  }, [memberDataList, setMember]);

  const option = memberDataList.map((data, index) => (
    <option key={index} value={data.data.name}>
      {data.data.name}
    </option>
  ));

  return (
    <div className="mb-4">
      <label htmlFor="member" className="block text-gray-700 font-medium mb-2">
        支払い者
      </label>
      <select
        id="member"
        value={member}
        onChange={(e) => setMember(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        required
      >
        {option}
      </select>
    </div>
  );
};
