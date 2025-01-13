import { HandleDeleteArgs, MemberIndexList } from "../types";

export const handleDelete = <T>(args: HandleDeleteArgs<T>) => {
  args.selectedDocumentIDSetter(args.documentID);
  args.selectedItemSetter(args.selectedItem);
  args.showModalSetter(true);
};

export const convetMemberIdToMemberName = (
  targetMemberId: string,
  memberDataList?: MemberIndexList[]
): string | null => {
  // 対象のメンバー名に一致する要素を検索
  let targetMember;
  if (memberDataList) {
    targetMember = memberDataList.find(
      (member) => member.id === targetMemberId
    );
  }

  // 該当するメンバーが見つかればそのIDを返し、見つからなければnullを返す
  return targetMember ? targetMember.data.name : null;
};
