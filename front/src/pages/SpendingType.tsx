import React, { useContext, useEffect, useState } from "react";
import MoneyTypeIndexList from "../components/MoneyTypeIndexList";
import SpendingCategoriesInputForm from "../components/SpendingCategoriesInputForm";
import {
  deleteDocument,
  getData,
  insertData,
  realtimeGetter,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { FieldValue, serverTimestamp } from "firebase/firestore";
import ConfirmModal from "../components/ConfirmModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

interface Data {
  category: string;
}

interface CategoryData {
  category: string;
  uid: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export default function SpendingCategory() {
  const userContext = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [categoryDataList, setCategoryDataList] = useState<
    { data: CategoryData; id: string }[]
  >([]);
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);

  const handleOnSubmit = (data: Data) => {
    if (userContext?.user?.uid) {
      const categoryInputValue: CategoryData = {
        category: data.category,
        uid: userContext.user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      insertData("spendingCategories", categoryInputValue);
    } else {
      //ユーザIDなしのエラー処理
      console.log("");
    }
  };
  const handleEdit = (index: string) => {
    console.log(index);
  };

  const confirmDelete = () => {
    const collectionName = "spendingCategories";
    if (selectedDocumentID) {
      deleteDocument(collectionName, selectedDocumentID);
    }
    setShowModal(false);
    setSelectedDocumentID(null);
  };

  const handleDelete = (documentID: string, categoryName: string) => {
    setSelectedDocumentID(documentID);
    setSelectedCategoryName(categoryName);
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
    <>
      <div className="font-bold text-gray-700 flex flex-col items-center justify-start">
        <div className="w-full max-w-lg">
          <div className="w-full p-1">
            <h1 className="text-2xl font-bold text-center mb-6">
              支出カテゴリー管理
            </h1>
            <div className="sticky top-0 z-10 w-full rounded-md">
              <SpendingCategoriesInputForm onSubmit={handleOnSubmit} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full p-1 rounded-md">
        <MoneyTypeIndexList
          fixedCosts={categoryDataList}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        ></MoneyTypeIndexList>
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
    </>
  );
}
