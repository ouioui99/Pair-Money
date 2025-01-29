import { useContext, useEffect, useState } from "react";
import SpendingCategoriesInputFormModal from "../components/SpendingCategoriesInputFormModal";
import {
  deleteDocument,
  createData,
  realtimeGetter,
  updateCategoryData,
} from "../firebase/firestore";
import { UserContext } from "../contexts/UserContextProvider";
import { serverTimestamp } from "firebase/firestore";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { findTargetIDObject } from "../util/calculateUtils";
import {
  CategoryIndexList,
  CategoryResponse,
  CommonResponseData,
  GroupResponse,
} from "../types";
import IndexListTHeader from "../components/IndexListTHeader";
import MoneyTypeIndexListTbody from "../components/MoneyTypeIndexListTBody";
import MoneyTypeIndexListMobile from "../components/MoneyTypeIndexListMobile";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import Header from "../components/Header";
import { useFirestoreListeners } from "../util/hooks/useFirestoreListeners";

export default function SpendingCategory() {
  const userContext = useContext(UserContext);
  const { addListener } = useFirestoreListeners();
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [categoryDataList, setCategoryDataList] = useState<
    CommonResponseData<CategoryResponse>[]
  >([]);
  const [categoryData, setCategoryData] =
    useState<CommonResponseData<CategoryResponse>>();

  const [category, setCategory] = useState<string>("");
  const [group, setGroup] = useState<CommonResponseData<GroupResponse>[]>([]);
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
          name: data.category,
          uid: userContext.user.uid,
          groupId: group[0].id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        createData("spendingCategories", categoryInputValue);
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
      setCategory(targetObject.data.name);
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

  const handleCancelClick = () => {
    setSelectedCategoryName(null);
    setCategory("");
    setShowFormModal(false);
  };

  const handleDelete = (documentID: string, item: CategoryIndexList) => {
    setSelectedDocumentID(documentID);
    setSelectedCategoryName(item.data.name);
    setShowModal(true);
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
      }
    };
    initialProcessing();
  }, [addListener]);

  useEffect(() => {
    const initialProcessing = async () => {
      if (userContext?.user?.uid && 0 < group.length) {
        const unsubscribeSpendingCategories = realtimeGetter(
          "spendingCategories",
          setCategoryDataList,
          {
            subDoc: "groupId",
            is: "==",
            subDocCondition: group[0].id,
          }
        );
        addListener(unsubscribeSpendingCategories);
      }
    };
    initialProcessing();
  }, [group]);

  return (
    <div className="h-[100dvh]">
      <Header
        title={"カテゴリ一覧"}
        onClick={() => setShowFormModal(true)}
      ></Header>
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
          onClose={handleCancelClick}
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
      <div className="mb-20"></div>
      <CustomBottomNavigation />
    </div>
  );
}
