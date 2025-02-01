import React, { useContext, useEffect, useState } from "react";
import IndexListTHeader from "../components/IndexListTHeader";
import SpendingIndexListTBody from "../components/SpendingIndexListTBody";
import {
  CategoryIndexList,
  CommonResponseData,
  FUser,
  GroupResponse,
  SpendingFormValue,
  SpendingIndexList,
  SpendingResponse,
  SpendingUpdataRequest,
} from "../types";
import SpendingIndexListMobile from "../components/SpendingIndexListMobile";
import {
  deleteDocument,
  getData,
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
import { convertIdToName } from "../util/commonFunc";
import { FiEdit, FiTrash2 } from "react-icons/fi";

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
  const [group, setGroup] = useState<CommonResponseData<GroupResponse>[]>([]);
  const [selectedSpendingData, setSelectedSpendingData] =
    useState<SpendingIndexList | null>(null);
  const [categoryDataList, setCategoryDataList] = useState<CategoryIndexList[]>(
    []
  );
  const [groupMemberDataList, setGroupMemberDataList] = useState<FUser[]>([]);

  const [selectMonth, setSelectMonth] = useState<string>("all");
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SpendingIndexList[]>([]);

  const handleOnSubmit = (data: SpendingFormValue) => {
    const spendingFormValue: SpendingUpdataRequest = {
      amount: data.amount,
      payerUid: data.payerUid,
      commonAccountPaid: data.commonAccountPaid,
      date: data.date.toDate(),
      categoryId: data.categoryId,
    };

    if (selectedSpendingData) {
      updateSpendingData(selectedSpendingData.id, spendingFormValue);
      setShowFormModal(false);
      setSelectedItems([]);
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

  const forDisplayCategoryDataList: { id: string; name: string }[] =
    categoryDataList.map((categoryDataObject) => {
      return {
        id: categoryDataObject.id,
        name: categoryDataObject.data.name,
      };
    });

  const handleCheckboxChange = (spendingData: SpendingIndexList) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => item.id === spendingData.id
      );

      if (isSelected) {
        // チェック解除: 選択リストから除去
        return prevSelected.filter((item) => item.id !== spendingData.id);
      } else {
        // チェック: リストに追加
        return [...prevSelected, spendingData];
      }
    });
  };

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid) {
        const unsubscribeGroups = realtimeGetter("groups", setGroup, {
          subDoc: "memberUids",
          is: "array-contains",
          subDocCondition: userContext.user.uid,
        });

        addListener(unsubscribeGroups);
        setInitialSetupComplete(true);
      }
    };

    initialProcessing();
  }, []);

  useEffect(() => {
    const initialProcessing = async () => {
      const groupId = group[0].id;
      const unsubscribeSpendings = realtimeGetter(
        "spendings",
        setSpendingDataList,
        {
          subDoc: "groupId",
          is: "==",
          subDocCondition: groupId,
        }
      );
      const unsubscribeSpendingCategories = realtimeGetter(
        "spendingCategories",
        setCategoryDataList,
        {
          subDoc: "groupId",
          is: "==",
          subDocCondition: groupId,
        }
      );

      addListener(unsubscribeSpendingCategories);
      addListener(unsubscribeSpendings);

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
    };

    if (0 < group.length) {
      initialProcessing();
    }
  }, [initialSetupComplete, group]);

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
    groupMemberDataList
  );

  return (
    <>
      <Header title={"支出情報"}></Header>

      <PaymentScreen
        spendingDataList={spendingDataList}
        groupMemberDataList={groupMemberDataList}
        payments={payments}
        selectMonth={selectMonth}
        setSelectMonth={setSelectMonth}
      />

      <div className="overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50 h-16">
          <h2 className="text-lg font-semibold">支出一覧</h2>

          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 h-10 px-4 text-base rounded-md transition-all focus:outline-none 
          ${
            selectedItems.length === 1
              ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
              disabled={selectedItems.length != 1}
              onClick={() => handleEdit(selectedItems[0].id)}
            >
              <FiEdit className="w-5 h-5" />
              編集
            </button>

            <button
              className={`flex items-center gap-2 h-10 px-4 text-base rounded-md transition-all focus:outline-none 
    ${
      1 <= selectedItems.length
        ? "bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300"
        : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
            >
              <FiTrash2 className="w-5 h-5" />
              削除
            </button>
          </div>
        </div>

        <table className="min-w-full hidden md:table table-auto">
          <IndexListTHeader
            tHeaders={["", "日付", "金額", "支払い", "清算者", "カテゴリー"]}
          />
          <SpendingIndexListTBody<CommonResponseData<SpendingResponse>>
            tbodyList={filteredSpendingDataList} // フィルタリング後のデータを渡す
            selectedItems={selectedItems}
            handleCheckboxChange={handleCheckboxChange}
            groupMemberDataList={groupMemberDataList}
            forDisplayCategoryDataList={forDisplayCategoryDataList}
          />
        </table>

        {/* モバイルビュー */}
        <SpendingIndexListMobile<CommonResponseData<SpendingResponse>>
          tbodyList={filteredSpendingDataList} // フィルタリング後のデータを渡す
          selectedItems={selectedItems}
          handleCheckboxChange={handleCheckboxChange}
          groupMemberDataList={groupMemberDataList}
          forDisplayCategoryDataList={forDisplayCategoryDataList}
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
              group={group}
            />
          </div>
        ) : null}

        <DeleteConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="この支出を削除しますか？"
          description={
            selectedSpendingData ? (
              <div className="space-y-4">
                <p className="text-sm text-center text-gray-600">
                  以下の支出情報が削除されます。本当に削除してよろしいですか？
                </p>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">日付</span>
                    <span className="text-gray-800 text-base font-semibold">
                      {dayjs(selectedSpendingData.data.date.toDate()).format(
                        "YYYY-MM-DD"
                      ) || "不明"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">金額</span>
                    <span className="text-green-600 text-lg font-bold">
                      ¥
                      {selectedSpendingData.data.amount?.toLocaleString() ||
                        "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">清算者</span>
                    <span className="text-gray-800 text-base font-medium">
                      {convertIdToName(
                        selectedSpendingData.data.payerUid,
                        "uid",
                        "name",
                        groupMemberDataList
                      ) || "不明"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">カテゴリー</span>
                    <span className="text-gray-800 text-base font-medium">
                      {convertIdToName(
                        selectedSpendingData.data.categoryId,
                        "id",
                        "name",
                        forDisplayCategoryDataList
                      ) || "未分類"}
                    </span>
                  </div>
                </div>
              </div>
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
