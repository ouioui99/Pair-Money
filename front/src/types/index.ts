import { FieldValue } from "firebase/firestore";

//common
export interface IndexLisHeader {
  tHeaders: string[];
}

export interface IndexListTbody<T> {
  tbodyList: T[];
  handleEdit: (index: string) => void;
  handleDelete: (documentID: string, item: T) => void;
}

export interface CommonResponseData<T> {
  data: T;
  id: string;
}

export interface HandleDeleteArgs<T> {
  documentID: string;
  selectedItem: T;
  selectedDocumentIDSetter: (
    value: React.SetStateAction<string | null>
  ) => void;
  selectedItemSetter: (value: React.SetStateAction<T | null>) => void;
  showModalSetter: (value: React.SetStateAction<boolean>) => void;
}

//spending
export type SpendingIndexList = {
  data: SpendingResponse;
  id: string;
};

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

export interface SpendingResponse {
  amount: string;
  category: string;
  createdAt: FieldValue;
  date: string;
  uid: string;
  updatedAt: FieldValue;
}

//category
export interface CategoryResponse {
  category: string;
  createdAt: FieldValue;
  uid: string;
  updatedAt: FieldValue;
}

export interface CategoryIndexList {
  data: CategoryResponse;
  id: string;
}
