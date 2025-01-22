import React, { useContext, useEffect, useState } from "react";
import { CommonResponseData, FUser, GroupResponse } from "../types";
import { getData } from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";

interface MemberSelect {
  payerUid: string;
  setPayerUid: (e: string) => void;
  group: CommonResponseData<GroupResponse>[];
}

export const MemberSelect: React.FC<MemberSelect> = ({
  payerUid,
  setPayerUid,
  group,
}) => {
  const [groupMemberDataList, setGroupMemberDataList] = useState<FUser[]>([]);
  const userContext = useContext(UserContext);
  // payerUidDataListが空でない場合に初期値を設定
  useEffect(() => {
    const initialProcessing = async () => {
      if (group.length > 0) {
        if (userContext?.user?.uid) {
          setPayerUid(userContext.user.uid);
        }

        const groupMemberUidList = group[0].data.memberUids;

        const userDataList = await Promise.all(
          groupMemberUidList.map((groupMemberUid) =>
            getData<FUser>("users", {
              subDoc: "uid",
              is: "==",
              subDocCondition: groupMemberUid,
            })
          )
        );

        const memberUserData = userDataList.map((userData) => userData[0]);

        setGroupMemberDataList(memberUserData);
      } else {
        setPayerUid(payerUid);
      }
    };
    initialProcessing();
  }, [group, setPayerUid]);

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
      <select
        id="payerUid"
        value={payerUid}
        onChange={(e) => setPayerUid(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        required
      >
        {option}
      </select>
    </div>
  );
};
