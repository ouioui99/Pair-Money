import React, { useContext, useEffect, useState } from "react";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import {
  CategoryIndexList,
  CommonResponseData,
  MemberIndexList,
  SpendingFormValue,
  SpendingIndexList,
  SpendingResponse,
  SpendingUpdataRequest,
} from "../types";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";
import {
  deleteDocument,
  realtimeGetter,
  updateSpendingData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import {
  calculatePaymentAmount,
  findTargetIDObject,
} from "../util/calculateUtils";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import ExpenseForm from "../components/ExpenseForm";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import PaymentScreen from "../components/PaymentScreen";
import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";
import dayjs from "dayjs";

export default function SpendingIndex() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();

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
  const [selectMonth, setSelectMonth] = useState<string>("all");

  const handleOnSubmit = (data: SpendingFormValue) => {
    const spendingFormValue: SpendingUpdataRequest = {
      amount: data.amount,
      payerUid: data.payerUid,
      date: data.date.toDate(),
      category: data.categoryId,
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
        const unsubscribeSpendings = realtimeGetter(
          "spendings",
          setSpendingDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        const unsubscribeSpendingCategories = realtimeGetter(
          "spendingCategories",
          setCategoryDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        const unsubscribeMembers = realtimeGetter(
          "members",
          setMemebersDataList,
          {
            subDoc: "uid",
            is: "==",
            subDocCondition: userContext.user.uid,
          }
        );
        addListener(unsubscribeSpendings);
        addListener(unsubscribeSpendingCategories);
        addListener(unsubscribeMembers);
      }
    };

    initialProcessing();
  }, [addListener]);

  // 清算月で spendingDataList をフィルタリング
  const filteredSpendingDataList = !dayjs(selectMonth).isValid()
    ? spendingDataList
    : spendingDataList.filter((spendingData) => {
        const date = dayjs(spendingData.data.date.toDate());
        const yearMonth = `${date.year()}-${date.month() + 1}`; // YYYY-MM形式
        const selectMonthDayjs = dayjs(selectMonth);
        return (
          yearMonth ===
          `${selectMonthDayjs.year()}-${selectMonthDayjs.month() + 1}`
        );
      });

  // フィルタリングした spendingDataList を基に payments を再計算
  const payments = calculatePaymentAmount(
    filteredSpendingDataList,
    membersDataList
  );

  return (
    <>
      <Header title={"支出情報"}></Header>

      <PaymentScreen
        spendingDataList={spendingDataList}
        membersDataList={membersDataList}
        payments={payments}
        selectMonth={selectMonth}
        setSelectMonth={setSelectMonth}
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
            tbodyList={filteredSpendingDataList} // フィルタリング後のデータを渡す
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            membersDataList={membersDataList}
          />
        </table>

        {/* モバイルビュー */}
        <SpendingIndexListMobile<CommonResponseData<SpendingResponse>>
          tbodyList={filteredSpendingDataList} // フィルタリング後のデータを渡す
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          membersDataList={membersDataList}
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
      <div className="mb-20"></div>
      <CustomBottomNavigation />
    </>
  );
}
