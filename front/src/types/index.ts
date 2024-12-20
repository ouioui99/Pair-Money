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

export interface paymentType {
  payer: string;
  receiver: string;
  amount: number;
}

//spending
export type SpendingIndexList = {
  data: SpendingResponse;
  id: string;
};

export interface CreateSpendingRequest {
  amount: string;
  date: string;
  category: string;
  member: string;
  uid: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface SpendingFormValue {
  amount: string;
  date: string;
  member: string;
  category: string;
}

export interface SpendingResponse {
  amount: string;
  category: string;
  member: string;
  createdAt: FieldValue;
  date: string;
  uid: string;
  updatedAt: FieldValue;
}

export interface SpendingUpdataRequest {
  amount: string;
  category: string;
  date: string;
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

//fixedCost
export interface FixedCostIndexList {
  data: FixedCostsResponse;
  id: string;
}

export interface FixedCostsResponse {
  amount: string;
  category: string;
  createdAt: FieldValue;
  uid: string;
  updatedAt: FieldValue;
}

export interface FixedCostFormValue {
  amount: string;
  category: string;
}

export interface FixedCostUpdataRequest {
  amount: string;
  category: string;
}

//member
export interface MemberIndexList {
  data: MembersResponse;
  id: string;
}

export interface MembersResponse {
  name: string;
  createdAt: FieldValue;
  uid: string;
  updatedAt: FieldValue;
}

export interface MemberFormValue {
  name: string;
}

//util
export interface PaymentSummary {
  [member: string]: number; // メンバー名をキーとして、その支払い合計金額を格納
}

export interface SplitResult {
  payer: string; // 支払う人
  receiver: string; // 支払われる人
  amount: number; // 支払う金額
}
