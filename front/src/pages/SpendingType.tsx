import React, { useContext, useEffect, useState } from "react";
import MoneyTypeIndexList from "../components/MoneyTypeIndexListTBody";
import SpendingCategoriesInputFormModal from "../components/SpendingCategoriesInputFormModal";
import {
  deleteDocument,
  getData,
  insertData,
  realtimeGetter,
  updateCategoryData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { findTargetIDObject } from "../util/calculateUtils";
import {
  CategoryIndexList,
  CategoryResponse,
  CommonResponseData,
  SpendingIndexList,
} from "../types";
import IndexListTHeader from "../components/IndexListTHeader";
import MoneyTypeIndexListTbody from "../components/MoneyTypeIndexListTBody";
import MoneyTypeIndexListMobile from "../components/MoneyTypeIndexListMobile";
import CustomBottomNavigation from "../components/CustomBottomNavigation";

export default function SpendingCategory() {
  const userContext = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [categoryDataList, setCategoryDataList] = useState<
    CommonResponseData<CategoryResponse>[]
  >([]);
  const [categoryData, setCategoryData] =
    useState<CommonResponseData<CategoryResponse>>();
  const [category, setCategory] = useState<string>("");
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);

  const handleOnSubmit = (data: { category: string }) => {
    if (userContext?.user?.uid) {
      if (typeof categoryData === "undefined") {
        const categoryInputValue: CategoryResponse = {
          category: data.category,
          uid: userContext.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        insertData("spendingCategories", categoryInputValue);
      } else {
        updateCategoryData(categoryData.id, data.category);
      }
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
    setCategoryData(undefined);
  };
  const handleEdit = (index: string) => {
    setShowFormModal(true);
    const targetObject = findTargetIDObject<CategoryResponse>(
      categoryDataList,
      index
    );
    if (typeof targetObject !== "undefined") {
      setCategory(targetObject.data.category);
      setCategoryData(targetObject);
    }
  };

  const confirmDelete = () => {
    const collectionName = "spendingCategories";
    if (selectedDocumentID) {
      deleteDocument(collectionName, selectedDocumentID);
    }
    setShowModal(false);
    setSelectedDocumentID(null);
  };

  const handleDelete = (documentID: string, item: CategoryIndexList) => {
    setSelectedDocumentID(documentID);
    setSelectedCategoryName(item.data.category);
    setShowModal(true);
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
    <div className="h-[100dvh]">
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">カテゴリー一覧</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowFormModal(true)}
        >
          新規作成
        </button>
      </header>
      <div className="flex-grow">
        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader tHeaders={["カテゴリー", "操作"]} />
          <MoneyTypeIndexListTbody<CommonResponseData<CategoryResponse>>
            tbodyList={categoryDataList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </table>

        <SpendingCategoriesInputFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleOnSubmit}
          category={category}
          setCategory={setCategory}
        />
      </div>

      <DeleteConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="このカテゴリーを削除しますか？"
        description={
          selectedCategoryName ? (
            <>
              <p className="text-sm text-center text-gray-600 mb-4">
                以下のカテゴリーを削除すると元に戻せません。
              </p>
              <p className="text-lg font-bold text-black bg-gray-100 px-4 py-2 rounded-md text-center">
                「{selectedCategoryName}」
              </p>
            </>
          ) : (
            "削除すると元に戻せません。本当に削除してよろしいですか？"
          )
        }
      />

      <MoneyTypeIndexListMobile<CommonResponseData<CategoryResponse>>
        tbodyList={categoryDataList}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <CustomBottomNavigation />
    </div>
  );
}
