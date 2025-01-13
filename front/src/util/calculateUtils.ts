import {
  CommonResponseData,
  MemberIndexList,
  PaymentSummary,
  SpendingResponse,
  SplitResult,
} from "../types";
import { convetMemberIdToMemberName } from "./commonFunc";

export const findTargetIDObject = <T>(
  List: CommonResponseData<T>[],
  id: string
): CommonResponseData<T> | undefined => {
  for (let index = 0; index < List.length; index++) {
    const object = List[index];
    if (object.id === id) {
      return object;
    }
  }
  return undefined;
};

export const calculatePaymentAmount = (
  spendingDataList: CommonResponseData<SpendingResponse>[],
  memberList: MemberIndexList[]
): SplitResult[] => {
  const totalAmountObjct = calculateTotalPayAmount(
    spendingDataList,
    memberList
  );
  const paymentAmount = calculateSplit(totalAmountObjct, memberList);

  return paymentAmount;
};

const calculateTotalPayAmount = (
  spendingDataList: CommonResponseData<SpendingResponse>[],
  memberList: MemberIndexList[]
): PaymentSummary => {
  const paymentSummary: PaymentSummary = spendingDataList.reduce(
    (acc, item) => {
      const member = convetMemberIdToMemberName(memberList, item.data.member);
      const amount = parseInt(item.data.amount, 10);

      // メンバーがすでに存在する場合は金額を加算、存在しない場合は初期化
      if (member) {
        if (acc[member]) {
          acc[member] += amount;
        } else {
          acc[member] = amount;
        }
      }

      return acc;
    },
    {} as PaymentSummary
  );
  return paymentSummary;
};

const calculateSplit = (
  payments: PaymentSummary,
  members: MemberIndexList[]
): SplitResult[] => {
  const totalAmount = Object.values(payments).reduce(
    (sum, amount) => sum + amount,
    0
  ); // 全体の支払総額
  const numMembers = members.length;
  const equalShare = totalAmount / numMembers; // 均等に支払うべき金額

  // 各メンバーの差額を計算
  const balances: { [key: string]: number } = {};

  members.forEach((member) => {
    const memberName = member.data.name;
    const paidAmount = payments[memberName] || 0;

    balances[memberName] = paidAmount - equalShare; // 支払った金額と均等分の差
  });

  const result: SplitResult[] = [];

  // 支払いが足りていないメンバー (差額が負)
  const payers = Object.keys(balances).filter((member) => balances[member] < 0);

  // 支払い過ぎているメンバー (差額が正)
  const receivers = Object.keys(balances).filter(
    (member) => balances[member] > 0
  );

  // 支払いが足りていない人に支払うべき金額を計算
  for (const payer of payers) {
    let remainingAmount = -balances[payer]; // 支払うべき金額

    for (const receiver of receivers) {
      if (remainingAmount <= 0) break; // もう支払うべき金額はない

      const amountToPay = Math.min(balances[receiver], remainingAmount);
      if (amountToPay > 0) {
        // 金額を四捨五入して支払い額を調整
        const roundedAmount = Math.round(amountToPay);

        result.push({
          payer,
          receiver,
          amount: roundedAmount,
        });

        balances[receiver] -= amountToPay; // 支払った額を減らす
        remainingAmount -= amountToPay; // 支払うべき金額を減らす
      }
    }
  }

  return result;
};

export const calculateTotalPaidByPerson = (
  membersDataList: MemberIndexList[],
  spendingDataList: CommonResponseData<SpendingResponse>[]
) => {
  const result = spendingDataList.reduce<Record<string, number>>(
    (totals, payment) => {
      const payer = convetMemberIdToMemberName(
        membersDataList,
        payment.data.member
      );
      const amount = parseInt(payment.data.amount, 10); // amountは文字列なので数値に変換
      if (payer) {
        // 支払者がすでに存在する場合、金額を加算、ない場合は初期化
        totals[payer] = (totals[payer] || 0) + amount;
      }

      return totals;
    },
    {}
  );

  return result;
};

export const calculateAllMembersTotalPaid = (
  totalPaidByPerson: Record<string, number>,
  memberNames: string[]
) => {
  console.log(totalPaidByPerson);
  console.log(memberNames);

  const result = memberNames.reduce((result, name) => {
    // すでに支払額がある場合はそのまま、それ以外は0で初期化
    result[name] = totalPaidByPerson[name] || 0;

    return result;
  }, {} as Record<string, number>);
  return result;
};
