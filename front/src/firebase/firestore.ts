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
} from "firebase/firestore";
import { db } from "./config";
import {
  FixedCostUpdataRequest,
  MemberFormValue,
  SpendingIndexList,
  SpendingResponse,
  SpendingUpdataRequest,
} from "../types";

export const insertData = async (table: string, data: Object) => {
  try {
    console.log(data);

    const docRef = await addDoc(collection(db, table), data);
    console.log("success");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const updateCategoryData = async (id: string, category: string) => {
  const targetDB = doc(db, "spendingCategories", id);

  await updateDoc(targetDB, {
    category: category,
    updateAt: serverTimestamp(),
  });
};

export const updateSpendingData = async (
  id: string,
  data: SpendingUpdataRequest
) => {
  const targetDB = doc(db, "spendings", id);
  console.log(id);
  console.log(targetDB);
  console.log(data);

  await updateDoc(targetDB, {
    amount: data.amount,
    date: data.date,
    category: data.category,
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
  });
};

export const updateMemberData = async (id: string, data: MemberFormValue) => {
  const targetDB = doc(db, "members", id);

  await updateDoc(targetDB, {
    amount: data.name,
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
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results: T[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ data: doc.data(), id: doc.id } as T);
    });
    setter(results);
    console.log(results);

    return results;
  });
};

export const deleteDocument = async (
  collectionName: string,
  documentID: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentID));
    console.log("Document successfully deleted!");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};
