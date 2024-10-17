import { List } from "postcss/lib/list";

export const transformApiData = (apiData: any) => {
  const textAnnotations = apiData.textAnnotations;
  const numberAndConmaReg = /[0-9,]+/g;
  const totalAmountNumbersAndConmaList = [];

  for (let i = 0; i < textAnnotations.length; i++) {
    const description = textAnnotations[i].description;
    if (description.match("合計")) {
      if (textAnnotations[i + 1].description === "¥") {
        for (let s = 2; s < 10; s++) {
          if (textAnnotations[i + s].description.match(numberAndConmaReg)) {
            totalAmountNumbersAndConmaList.push(
              textAnnotations[i + s].description
            );
          } else {
            break;
          }
        }
      }
    }
  }

  const totalAmount = getTotalAmount(totalAmountNumbersAndConmaList);
  console.log(totalAmount);

  return totalAmount;
};

const getTotalAmount = (totalAmountNumbersAndConmaList: any[]) => {
  const intAmountList = getIntAmountList(totalAmountNumbersAndConmaList);
  switch (intAmountList.length) {
    case 1:
      return intAmountList[0];

    case 0:
      return "合計の抽出に失敗しました。";

    default:
      break;
  }
  console.log(totalAmountNumbersAndConmaList);
};

const getIntAmountList = (amountList: any[]) => {
  const intAmountList = [];
  for (let i = 0; i < amountList.length; i++) {
    const totalAmountStr = amountList[i].replace(/,/g, "");
    const totalAmountInt = parseInt(totalAmountStr, 10);
    intAmountList.push(totalAmountInt);
  }
  return intAmountList;
};
