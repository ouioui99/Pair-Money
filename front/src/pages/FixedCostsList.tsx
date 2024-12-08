import React, { useContext, useEffect, useState } from "react";
import FixedCostsInputForm from "../components/FixedCostsInputForm";
import IndexList from "../components/IndexList";
import FixedCostsPage from "../components/FixedCostsInputForm";

import FixedCostsIndexList from "../components/FixedCostsIndexList";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ExpenseForm from "../components/ExpenseForm";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import {
  CategoryIndexList,
  CommonResponseData,
  FixedCostFormValue,
  FixedCostList,
  SpendingResponse,
} from "../types";
import { deleteDocument, realtimeGetter } from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";

export default function FixedCostsList() {
  const userContext = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedFixedCostData, setSelectedFixedCostData] =
    useState<FixedCostList | null>(null);

  const [fixedDataList, setFixedDataList] = useState<FixedCostList[]>([]);
  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );
  const handleOnSubmit = (data: FixedCostFormValue) => {
    console.log(data);
  };
  const handleEdit = (index: number) => {
    console.log(index);
  };

  const handleDelete = (index: number) => {
    console.log(index);
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
        realtimeGetter("spendingCategories", setCategoryDataList, {
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
        <h1 className="text-xl font-semibold">固定費一覧</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowFormModal(true)}
        >
          新規作成
        </button>
      </header>
      <div className="overflow-hidden">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader
            tHeaders={["タイトル", "金額", "カテゴリー", "操作"]}
          />
          {/* <MoneyTypeIndexListTbody<CommonResponseData<CategoryResponse>>
            tbodyList={categoryDataList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </table>

        {showFormModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={handleBackgroundClick}
          >
            <FixedCostsInputForm
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
        title="このカテゴリーを削除しますか？"
        description={
          selectedFixedCostData ? (
            <>
              <p className="text-sm text-center text-gray-600 mb-4">
                以下のカテゴリーを削除すると元に戻せません。
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

      {/* <MoneyTypeIndexListMobile<CommonResponseData<CategoryResponse>>
        tbodyList={categoryDataList}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      /> */}

      {/* <div className="font-bold text-gray-700 flex flex-col items-center justify-start">
        <div className="w-full max-w-lg">
          <div className="w-full p-1">
            <h1 className="text-2xl font-bold text-center mb-6">固定費管理</h1>
            <div className="sticky top-0 z-10 w-full rounded-md"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-1 rounded-md">
        <FixedCostsIndexList
          fixedCosts={[{ amount: 1000, category: "string" }]}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        ></FixedCostsIndexList>
      </div> */}
    </>
  );
}
