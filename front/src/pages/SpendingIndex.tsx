import React, { useContext, useEffect, useState } from "react";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import {
  CategoryResponse,
  CommonResponseData,
  CreateSpendingRequest,
  SpendingFormValue,
  SpendingIndexList,
  SpendingResponse,
} from "../types";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";
import {
  deleteDocument,
  insertData,
  realtimeGetter,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import { findTargetIDObject } from "../util/calculateUtils";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function SpendingIndex() {
  const userContext = useContext(UserContext);
  const [spendingDataList, setSpendingDataList] = useState<
    CommonResponseData<SpendingResponse>[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [spending, setSpendig] = useState<string>("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [spendingData, setSpendingData] =
    useState<CommonResponseData<SpendingResponse>>();
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedSpendingData, setSelectedSpendingData] =
    useState<SpendingIndexList | null>(null);

  const handleOnSubmit = (data: SpendingFormValue) => {
    if (userContext?.user?.uid) {
      const spendingFormValue: CreateSpendingRequest = {
        amount: data.amount,
        date: data.date,
        category: data.category,
        uid: userContext.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      insertData("spendings", spendingFormValue);
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
  };
  const handleEdit = (index: string) => {
    setShowFormModal(true);
    const targetObject = findTargetIDObject<SpendingResponse>(
      spendingDataList,
      index
    );
    if (typeof targetObject !== "undefined") {
      //setCategory(targetObject.data.category);
      setSpendingData(targetObject);
    }
  };

  const confirmDelete = () => {
    const collectionName = "spendings";
    if (selectedDocumentID) {
      deleteDocument(collectionName, selectedDocumentID);
    }
    setShowModal(false);
    setSelectedDocumentID(null);
  };

  const handleDelete = (
    documentID: string,
    spendingIndexList: SpendingIndexList
  ) => {
    setSelectedDocumentID(documentID);
    setSelectedSpendingData(spendingIndexList);
    setShowModal(true);
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        realtimeGetter("spendings", setSpendingDataList, {
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
        <h1 className="text-xl font-semibold">支出一覧</h1>
        {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => console.log("新規作成ボタンがクリックされました")}
        >
          新規作成
        </button> */}
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader tHeaders={["日付", "金額", "カテゴリー", "操作"]} />
          <SpendingIndexListTBody<CommonResponseData<SpendingResponse>>
            tbodyList={spendingDataList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </table>
        {/* モバイルビュー */}
        <SpendingIndexListMobile<CommonResponseData<SpendingResponse>>
          tbodyList={spendingDataList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <DeleteConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="このカテゴリーを削除しますか？"
          description={
            selectedSpendingData ? (
              <>
                <p className="text-sm text-center text-gray-600 mb-4">
                  以下のカテゴリーを削除すると元に戻せません。
                </p>
                <p className="text-lg font-bold text-black bg-gray-100 px-4 py-2 rounded-md text-center">
                  「{selectedSpendingData.id}」
                </p>
              </>
            ) : (
              "削除すると元に戻せません。本当に削除してよろしいですか？"
            )
          }
        />
      </div>
    </>
  );
}
