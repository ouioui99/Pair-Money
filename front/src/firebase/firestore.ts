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
} from "firebase/firestore";
import { db } from "./config";

export const insertData = async (table: string, data: Object) => {
  try {
    const docRef = await addDoc(collection(db, table), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
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
      results.push(doc.data() as T);
    });
    // results.sort((a, b) =>
    //   a.created_at > b.created_at ? 1 : -1
    // )
    setter(results);
    return unsubscribe;
  });
};
