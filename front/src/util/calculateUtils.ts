import {
  CommonResponseData,
  FUser,
  PaymentSummary,
  SpendingResponse,
  SplitResult,
} from "../types";
import { convertIdToName } from "./commonFunc";

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
  memberList: FUser[]
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
  memberList: FUser[]
): PaymentSummary => {
  const paymentSummary: PaymentSummary = spendingDataList.reduce(
    (acc, item) => {
      const member = convertIdToName(
        item.data.payerUid,
        "uid",
        "name",
        memberList
      );
      const amount = parseInt(item.data.amount, 10);
      const isCommonAccount = item.data.commonAccountPaid || false;
      const memberCount = memberList.length;

      if (isCommonAccount) {
        // 共通口座の支払いを各メンバーに均等に割り勘
        const sharePerMember = Math.floor(amount / memberCount);
        memberList.forEach((member) => {
          acc[member.name] = (acc[member.name] || 0) + sharePerMember;
        });
      } else if (member) {
        // 通常支払い処理
        acc[member] = (acc[member] || 0) + amount;
      }

      return acc;
    },
    {} as PaymentSummary
  );

  return paymentSummary;
};

const calculateSplit = (
  payments: PaymentSummary,
  members: FUser[]
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
    const memberName = member.name;
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
  membersDataList: FUser[],
  spendingDataList: CommonResponseData<SpendingResponse>[]
) => {
  const memberNames = membersDataList.map((member) => member.name);

  const result = spendingDataList.reduce<Record<string, number>>(
    (totals, payment) => {
      const payer = convertIdToName(
        payment.data.payerUid,
        "uid",
        "name",
        membersDataList
      );

      const amount = parseInt(payment.data.amount, 10);
      const isCommonAccount = payment.data.commonAccountPaid || false;

      if (isCommonAccount) {
        // 共通口座支払いをすべてのメンバーに均等加算
        const sharePerMember = Math.floor(amount / memberNames.length);
        memberNames.forEach((name) => {
          totals[name] = (totals[name] || 0) + sharePerMember;
        });
      } else if (payer) {
        // 通常の支払い処理
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
  const result = memberNames.reduce((result, name) => {
    // すでに支払額がある場合はそのまま、それ以外は0で初期化
    result[name] = totalPaidByPerson[name] || 0;

    return result;
  }, {} as Record<string, number>);
  return result;
};
