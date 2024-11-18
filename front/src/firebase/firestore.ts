import { collection, addDoc } from "firebase/firestore";
import { db } from "./config";

export const insertData = async (table: string, data: Object) => {
  try {
    const docRef = await addDoc(collection(db, table), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
