import { FieldValue } from "firebase/firestore";

//common
export interface IndexLisHeader {
  tHeaders: string[];
}

export interface IndexListTbody<T> {
  tbodyList: T;
  handleEdit: (index: string) => void;
  handleDelete: (documentID: string, categoryName: string) => void;
}

export interface CommonResponseData<T> {
  data: T;
  id: string;
}

//spending
export interface SpendingIndexList {
  amount: number;
  date: string;
  category: string;
}

export interface CreateSpendingRequest {
  amount: number;
  date: string;
  category: string;
  uid: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface SpendingFormValue {
  amount: number;
  date: string;
  category: string;
}

//category
export interface CategoryResponse {
  category: string;
  createdAt: FieldValue;
  uid: string;
  updatedAt: FieldValue;
}

export interface CategoryIndexList {
  data: { category: string; uid: string };
  id: string;
}

export interface CategoryData {
  data: CategoryResponse;
  id: string;
}
