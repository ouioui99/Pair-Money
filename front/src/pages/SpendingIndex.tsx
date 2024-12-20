import React, { useContext, useEffect, useState } from "react";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import {
  CategoryIndexList,
  CategoryResponse,
  CommonResponseData,
  CreateSpendingRequest,
  MemberIndexList,
  SpendingFormValue,
  SpendingIndexList,
  SpendingResponse,
  SpendingUpdataRequest,
} from "../types";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";
import {
  deleteDocument,
  insertData,
  realtimeGetter,
  updateSpendingData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import {
  calculatePaymentAmount,
  findTargetIDObject,
} from "../util/calculateUtils";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ExpenseForm from "../components/ExpenseForm";
import { useLocation } from "react-router-dom";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import PaymentPerPerson from "../components/PaymentPerPerson";
import PaymentScreen from "../components/PaymentScreen";

export default function SpendingIndex() {
  const userContext = useContext(UserContext);
  const [spendingDataList, setSpendingDataList] = useState<
    CommonResponseData<SpendingResponse>[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(
    null
  );
  const [selectedSpendingData, setSelectedSpendingData] =
    useState<SpendingIndexList | null>(null);

  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );

  const [membersDataList, setMemebersDataList] = useState<MemberIndexList[]>(
    []
  );

  const [settlementMonth, useSettlementMonth] = useState<string>("");

  const handleOnSubmit = (data: SpendingFormValue) => {
    const spendingFormValue: SpendingUpdataRequest = {
      amount: data.amount,
      date: data.date,
      category: data.category,
    };

    if (selectedSpendingData) {
      updateSpendingData(selectedSpendingData.id, spendingFormValue);
      setShowFormModal(false);
    }
  };
  const handleEdit = (index: string) => {
    setShowFormModal(true);

    const targetObject = findTargetIDObject<SpendingResponse>(
      spendingDataList,
      index
    );
    if (typeof targetObject !== "undefined") {
      setSelectedSpendingData(targetObject);
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

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowFormModal(false);
    }
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        realtimeGetter("spendings", setSpendingDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
        realtimeGetter("spendingCategories", setCategoryDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
        realtimeGetter("members", setMemebersDataList, {
          subDoc: "uid",
          is: "==",
          subDocCondition: userContext.user.uid,
        });
      }
    };

    initialProcessing();
  }, []);

  const payments = calculatePaymentAmount(spendingDataList, membersDataList);
  return (
    <>
      <header className="p-4 border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold">支出情報</h1>
      </header>

      <PaymentScreen
        spendingDataList={spendingDataList}
        membersDataList={membersDataList}
        payments={payments}
      />

      <div className="overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold">支出一覧</h2>
        </div>

        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader
            tHeaders={["日付", "金額", "支払い者", "カテゴリー", "操作"]}
          />
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
        {showFormModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={handleBackgroundClick}
          >
            <ExpenseForm
              onSubmit={handleOnSubmit}
              spendingInitialValues={
                selectedSpendingData ? selectedSpendingData : undefined
              }
              categoryDataList={categoryDataList}
              memberDataList={membersDataList}
            />
          </div>
        ) : null}

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
      <CustomBottomNavigation />
    </>
  );
}
