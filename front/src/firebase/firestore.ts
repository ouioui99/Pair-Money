import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  WhereFilterOp,
  onSnapshot,
  serverTimestamp,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import {
  FixedCostUpdataRequest,
  MemberFormValue,
  SpendingUpdataRequest,
} from "../types";
import { spendingCategoriesSeedingData } from "./data/spendingCategoriesSeedingData";
import { membersSeedingData } from "./data/membersSeedingData";

export const insertData = async (table: string, data: Object) => {
  try {
    await addDoc(collection(db, table), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateCategoryData = async (id: string, category: string) => {
  const targetDB = doc(db, "spendingCategories", id);

  await updateDoc(targetDB, {
    category: category,
    updatedAt: serverTimestamp(),
  });
};

export const updateSpendingData = async (
  id: string,
  data: SpendingUpdataRequest
) => {
  const targetDB = doc(db, "spendings", id);

  await updateDoc(targetDB, {
    amount: data.amount,
    date: data.date,
    category: data.category,
    updatedAt: serverTimestamp(),
  });
};

export const updateFixedCostData = async (
  id: string,
  data: FixedCostUpdataRequest
) => {
  const targetDB = doc(db, "fixedCosts", id);

  await updateDoc(targetDB, {
    amount: data.amount,
    category: data.category,
    updatedAt: serverTimestamp(),
  });
};

export const updateMemberData = async (id: string, data: MemberFormValue) => {
  const targetDB = doc(db, "members", id);

  await updateDoc(targetDB, {
    name: data.name,
    updatedAt: serverTimestamp(),
  });
};

type CategoryData = {
  category: string;
  uid: string;
};

export const getData = async (
  table: string,
  conditions: { subDoc: string; is: WhereFilterOp; subDocCondition: string }
): Promise<CategoryData[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = query(
        collection(db, table),
        where(conditions.subDoc, conditions.is, conditions.subDocCondition)
      );
      const querySnapshot = await getDocs(q);

      const results: CategoryData[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as CategoryData);
      });

      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
};

export const realtimeGetter = <T>(
  table: string,
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  conditions: { subDoc: string; is: WhereFilterOp; subDocCondition: string }
) => {
  const q = query(
    collection(db, table),
    where(conditions.subDoc, conditions.is, conditions.subDocCondition),
    orderBy("updatedAt", "asc")
  );
  onSnapshot(q, (querySnapshot) => {
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ data: doc.data(), id: doc.id } as T);
    });
    setter(results);

    return results;
  });
};

export const deleteDocument = async (
  collectionName: string,
  documentID: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentID));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

export const seedingData = async (userId: string) => {
  const batch = writeBatch(db);

  for (const data of spendingCategoriesSeedingData) {
    const spendingCategoriesRef = doc(collection(db, "spendingCategories"));

    // 各ドキュメントにデータを設定
    batch.set(spendingCategoriesRef, {
      ...data,
      uid: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  for (const data of membersSeedingData) {
    const spendingCategoriesRef = doc(collection(db, "members"));

    // 各ドキュメントにデータを設定
    batch.set(spendingCategoriesRef, {
      ...data,
      uid: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  // バッチを書き込む
  try {
    await batch.commit();
  } catch (error) {
    console.error("ドキュメントの書き込み中にエラーが発生しました: ", error);
  }
};
