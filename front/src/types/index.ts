import { FieldValue } from "firebase/firestore";

export interface CategoryResponse {
  category: string;
  createdAt: FieldValue;
  uid: string;
  updatedAt: FieldValue;
}

export interface CommonResponseData<T> {
  data: T;
  id: string;
}
