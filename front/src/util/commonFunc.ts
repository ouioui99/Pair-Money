import { FUser, HandleDeleteArgs, MemberIndexList } from "../types";

export const handleDelete = <T>(args: HandleDeleteArgs<T>) => {
  args.selectedDocumentIDSetter(args.documentID);
  args.selectedItemSetter(args.selectedItem);
  args.showModalSetter(true);
};

export const convetMemberIdToMemberName = (
  targetMemberId: string,
  memberDataList?: FUser[]
): string | null => {
  // 対象のメンバー名に一致する要素を検索
  let targetMember;
  if (memberDataList) {
    targetMember = memberDataList.find(
      (member) => member.uid === targetMemberId
    );
  }

  // 該当するメンバーが見つかればそのIDを返し、見つからなければnullを返す
  return targetMember ? targetMember.name : null;
};

export const convertIdToName = <T>(
  targetId: string,
  keyForId: keyof T, // ID に対応するキーを指定
  keyForName: keyof T, // 名前に対応するキーを指定
  dataList?: T[]
): string | null => {
  if (!dataList) return null;

  const targetItem = dataList.find((item) => item[keyForId] === targetId);

  return targetItem ? String(targetItem[keyForName]) : null;
};

export const sha256 = async (text: string) => {
  const uint8 = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", uint8);
  return Array.from(new Uint8Array(digest))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
};

export const fnv1a32 = (str: string) => {
  const FNV_PRIME = 0x01000193; // FNV-1a 32-bit prime
  const OFFSET_BASIS = 0x811c9dc5; // FNV-1a 32-bit offset basis

  let hash = OFFSET_BASIS;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i); // XOR with the current character
    hash = (hash * FNV_PRIME) >>> 0; // Multiply by the FNV prime and ensure 32-bit
  }

  const hasedValue = hash >>> 0;
  return hasedValue.toString(16); // Ensure unsigned 32-bit integer
};
