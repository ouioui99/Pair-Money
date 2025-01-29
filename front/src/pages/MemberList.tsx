import React, { useContext, useEffect, useState } from "react";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import IndexListTHeader from "../components/IndexListTHeader";
import {
  CommonResponseData,
  MemberFormValue,
  MemberIndexList,
  MembersResponse,
} from "../types";
import {
  deleteDocument,
  createData,
  realtimeGetter,
  updateMemberData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import { findTargetIDObject } from "../util/calculateUtils";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import MemberIndexListTBody from "../components/MemberIndexListTBody";
import MemberInputForm from "../components/MemberInputForm";
import MemberIndexListMobile from "../components/MemberIndexListMobile";
import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";

export default function MemberList() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();
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

  const [isEdit, setIsEdit] = useState(false);

  const handleOnSubmit = (memberFormData: MemberFormValue) => {
    if (userContext?.user?.uid) {
      if (!isEdit) {
        const membarFormValue: MembersResponse = {
          name: memberFormData.name,
          uid: userContext.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        createData("members", membarFormValue);
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

  const handleCancelClick = () => {
    setSelectedMemberData(null);
    setShowFormModal(false);
  };

  const confirmDelete = () => {
    const collectionName = "members";
    if (selectedDocumentID) {
      deleteDocument(collectionName, selectedDocumentID);
    }
    setShowModal(false);
    setSelectedDocumentID(null);
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        const unsubscribeMembers = realtimeGetter(
          "members",
          setMemberDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        addListener(unsubscribeMembers);
      }
    };

    initialProcessing();
  }, [addListener]);
  return (
    <>
      <Header
        title={"メンバー一覧"}
        onClick={() => setShowFormModal(true)}
      ></Header>

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
              onClose={handleCancelClick}
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
                「{selectedMemberData.data.name}」
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
