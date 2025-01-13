import { HandleDeleteArgs, MemberIndexList } from "../types";

export const handleDelete = <T>(args: HandleDeleteArgs<T>) => {
  args.selectedDocumentIDSetter(args.documentID);
  args.selectedItemSetter(args.selectedItem);
  args.showModalSetter(true);
};

export const convetMemberIdToMemberName = (
  memberDataList: MemberIndexList[],
  targetMemberId: string
): string | null => {
  // 対象のメンバー名に一致する要素を検索
  const targetMember = memberDataList.find(
    (member) => member.id === targetMemberId
  );

  // 該当するメンバーが見つかればそのIDを返し、見つからなければnullを返す
  return targetMember ? targetMember.data.name : null;
};
