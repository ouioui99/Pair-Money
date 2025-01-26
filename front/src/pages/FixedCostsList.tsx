import React, { useContext, useEffect, useState } from "react";
import FixedCostsInputForm from "../components/FixedCostsInputForm";

import DeleteConfirmModal from "../components/DeleteConfirmModal";
import IndexListTHeader from "../components/IndexListTHeader";
import {
  CategoryIndexList,
  CommonResponseData,
  FixedCostFormValue,
  FixedCostIndexList,
  FixedCostsResponse,
} from "../types";
import {
  deleteDocument,
  createData,
  realtimeGetter,
  updateFixedCostData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import FixedCostIndexListTBody from "../components/FixedCostIndexListTBody";
import { serverTimestamp } from "firebase/firestore";
import { findTargetIDObject } from "../util/calculateUtils";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import FixedCostIndexListMobile from "../components/FixedCostIndexListMobile";

import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";

export default function FixedCostsList() {
  const { addListener } = useFirestoreListeners();
  const userContext = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedFixedCostData, setSelectedFixedCostData] =
    useState<FixedCostIndexList | null>(null);

  const [fixedDataList, setFixedDataList] = useState<
    CommonResponseData<FixedCostsResponse>[]
  >([]);

  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );

  const [isEdit, setIsEdit] = useState(false);

  const handleOnSubmit = (fixedFormData: FixedCostFormValue) => {
    if (userContext?.user?.uid) {
      if (!isEdit) {
        const fixedCostFormValue: FixedCostsResponse = {
          category: fixedFormData.category,
          amount: fixedFormData.amount,
          uid: userContext.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        createData("fixedCosts", fixedCostFormValue);
      } else {
        if (selectedDocumentID) {
          updateFixedCostData(selectedDocumentID, fixedFormData);
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

    const targetObject = findTargetIDObject<FixedCostsResponse>(
      fixedDataList,
      index
    );
    if (typeof targetObject !== "undefined") {
      setSelectedFixedCostData(targetObject);
    }
  };

  const handleDelete = (
    documentID: string,
    spendingIndexList: FixedCostIndexList
  ) => {
    setSelectedDocumentID(documentID);
    setSelectedFixedCostData(spendingIndexList);
    setShowModal(true);
  };

  const handleCancelClick = () => {
    setSelectedFixedCostData(null);
    setShowFormModal(false);
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
        const unsubscribeSpendingCategories = realtimeGetter(
          "spendingCategories",
          setCategoryDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        const unsubscribeFixedCosts = realtimeGetter(
          "fixedCosts",
          setFixedDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        addListener(unsubscribeSpendingCategories);
        addListener(unsubscribeFixedCosts);
      }
    };

    initialProcessing();
  }, [addListener]);

  return (
    <>
      <Header
        title={"固定費一覧"}
        onClick={() => setShowFormModal(true)}
      ></Header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader tHeaders={["金額", "カテゴリー", "操作"]} />
          <FixedCostIndexListTBody<CommonResponseData<FixedCostsResponse>>
            tbodyList={fixedDataList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </table>

        {showFormModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={handleBackgroundClick}
          >
            <FixedCostsInputForm
              isOpen={showFormModal}
              onClose={handleCancelClick}
              onSubmit={handleOnSubmit}
              initialValues={
                selectedFixedCostData ? selectedFixedCostData : undefined
              }
              categoryDataList={categoryDataList}
            />
          </div>
        ) : null}
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="この固定費を削除しますか？"
        description={
          selectedFixedCostData ? (
            <>
              <p className="text-sm text-center text-gray-600 mb-4">
                以下の固定費を削除すると元に戻せません。
              </p>
              <p className="text-lg font-bold text-black bg-gray-100 px-4 py-2 rounded-md text-center">
                {/* 「{selectedFixedCostData}」 */}
              </p>
            </>
          ) : (
            "削除すると元に戻せません。本当に削除してよろしいですか？"
          )
        }
      />

      <FixedCostIndexListMobile<CommonResponseData<FixedCostsResponse>>
        tbodyList={fixedDataList}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CustomBottomNavigation />
    </>
  );
}
