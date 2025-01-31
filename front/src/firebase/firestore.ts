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

export const createData = async (table: string, data: Object) => {
  try {
    await addDoc(collection(db, table), data);
  } catch (e) {
    throw new Error((e as Error).message || "An unknown error occurred");
  }
};

export const createDataReturnDocId = async (table: string, data: Object) => {
  try {
    const docRef = addDoc(collection(db, table), data);
    return docRef;
  } catch (e) {
    throw new Error((e as Error).message || "An unknown error occurred");
  }
};

export const addData = async (
  table: string,
  docId: string,
  fieldName: string,
  data: any
) => {
  const targetDB = doc(db, table, docId);

  await updateDoc(targetDB, {
    [fieldName]: data,
  });
};

export const updateCategoryData = async (id: string, category: string) => {
  const targetDB = doc(db, "spendingCategories", id);

  await updateDoc(targetDB, {
    name: category,
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
    payerUid: data.payerUid,
    date: data.date,
    categoryId: data.categoryId,
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

export const getData = async <T>(
  table: string,
  conditions: { subDoc: string; is: WhereFilterOp; subDocCondition: string }
): Promise<T[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = query(
        collection(db, table),
        where(conditions.subDoc, conditions.is, conditions.subDocCondition)
      );
      const querySnapshot = await getDocs(q);

      const results: T[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as T);
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
  conditions: {
    subDoc: string;
    is: WhereFilterOp;
    subDocCondition: string | {};
  },
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const q = query(
    collection(db, table),
    where(conditions.subDoc, conditions.is, conditions.subDocCondition),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ data: doc.data(), id: doc.id } as T);
    });
    setter(results);

    if (setLoading) {
      setLoading(false);
    }
  });

  // `unsubscribe` を返して呼び出し元で解除可能にする
  return unsubscribe;
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

export const seedingData = async (userId: string, groupId: string) => {
  const batch = writeBatch(db);

  for (const data of spendingCategoriesSeedingData) {
    const spendingCategoriesRef = doc(collection(db, "spendingCategories"));
    const seedingData = groupId
      ? {
          ...data,
          uid: userId,
          groupId: groupId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      : {
          ...data,
          uid: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

    // 各ドキュメントにデータを設定
    batch.set(spendingCategoriesRef, seedingData);
  }

  // for (const data of membersSeedingData) {
  //   const spendingCategoriesRef = doc(collection(db, "members"));

  //   // 各ドキュメントにデータを設定
  //   batch.set(spendingCategoriesRef, {
  //     ...data,
  //     uid: userId,
  //     createdAt: serverTimestamp(),
  //     updatedAt: serverTimestamp(),
  //   });
  // }

  // バッチを書き込む
  try {
    await batch.commit();
  } catch (error) {
    console.error("ドキュメントの書き込み中にエラーが発生しました: ", error);
  }
};
