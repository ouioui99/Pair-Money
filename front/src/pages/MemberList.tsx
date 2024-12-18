import React, { useContext, useEffect, useState } from "react";
import FixedCostsInputForm from "../components/MemberInputForm";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import IndexListTHeader from "../components/IndexListTHeader";
import {
  CategoryIndexList,
  CommonResponseData,
  FixedCostFormValue,
  FixedCostIndexList,
  FixedCostsResponse,
  MemberFormValue,
  MemberIndexList,
  MembersResponse,
  SpendingResponse,
} from "../types";
import {
  deleteDocument,
  insertData,
  realtimeGetter,
  updateFixedCostData,
  updateMemberData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import FixedCostIndexListTBody from "../components/FixedCostIndexListTBody";
import { serverTimestamp } from "firebase/firestore";
import { findTargetIDObject } from "../util/calculateUtils";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import FixedCostIndexListMobile from "../components/FixedCostIndexListMobile";
import MemberIndexListTBody from "../components/MemberIndexListTBody";
import MemberInputForm from "../components/MemberInputForm";
import MemberIndexListMobile from "../components/MemberIndexListMobile";

export default function MemberList() {
  const userContext = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedMemberData, setSelectedMemberData] =
    useState<MemberIndexList | null>(null);

  const [memberDataList, setMemberDataList] = useState<
    CommonResponseData<MembersResponse>[]
  >([]);

  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );

  const [isEdit, setIsEdit] = useState(false);

  const handleOnSubmit = (memberFormData: MemberFormValue) => {
    if (userContext?.user?.uid) {
      if (!isEdit) {
        const membarFormValue: MembersResponse = {
          memberName: memberFormData.memberName,
          uid: userContext.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        insertData("members", membarFormValue);
      } else {
        if (selectedDocumentID) {
          updateMemberData(selectedDocumentID, memberFormData);
          setIsEdit(false);
        }
      }
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
  };
  const handleEdit = (index: string) => {
    setShowFormModal(true);
    setIsEdit(true);
    setSelectedDocumentID(index);

    const targetObject = findTargetIDObject<MembersResponse>(
      memberDataList,
      index
    );
    if (typeof targetObject !== "undefined") {
      setSelectedMemberData(targetObject);
    }
  };

  const handleDelete = (
    documentID: string,
    memberIndexList: MemberIndexList
  ) => {
    setSelectedDocumentID(documentID);
    setSelectedMemberData(memberIndexList);
    setShowModal(true);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowFormModal(false);
    }
  };

  const confirmDelete = () => {
    const collectionName = "fixedCosts";
    if (selectedDocumentID) {
      deleteDocument(collectionName, selectedDocumentID);
    }
    setShowModal(false);
    setSelectedDocumentID(null);
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        realtimeGetter("members", setMemberDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
      }
    };

    initialProcessing();
  }, []);
  return (
    <>
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">メンバー一覧</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowFormModal(true)}
        >
          新規作成
        </button>
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader tHeaders={["メンバー名", "操作"]} />
          <MemberIndexListTBody<CommonResponseData<MembersResponse>>
            tbodyList={memberDataList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </table>

        {showFormModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={handleBackgroundClick}
          >
            <MemberInputForm
              isOpen={showFormModal}
              onClose={() => setShowFormModal(false)}
              onSubmit={handleOnSubmit}
              initialValues={
                selectedMemberData ? selectedMemberData : undefined
              }
            />
          </div>
        ) : null}
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="このメンバーを削除しますか？"
        description={
          selectedMemberData ? (
            <>
              <p className="text-sm text-center text-gray-600 mb-4">
                以下のメンバーを削除すると元に戻せません。
              </p>
              <p className="text-lg font-bold text-black bg-gray-100 px-4 py-2 rounded-md text-center">
                「{selectedMemberData.data.memberName}」
              </p>
            </>
          ) : (
            "削除すると元に戻せません。本当に削除してよろしいですか？"
          )
        }
      />

      <MemberIndexListMobile<CommonResponseData<MembersResponse>>
        tbodyList={memberDataList}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CustomBottomNavigation />
    </>
  );
}
