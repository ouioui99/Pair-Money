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

  return totalAmount;
};

const getTotalAmount = (totalAmountNumbersAndConmaList: any[]) => {
  const intAmount = getIntAmount(totalAmountNumbersAndConmaList);

  switch (typeof intAmount) {
    case "number":
      return intAmount;

    default:
      return "合計の抽出に失敗しました。";
  }
};

const getIntAmount = (amountList: any[]) => {
  const intAmount = parseInt(amountList.join("").replace(",", ""), 10);
  return intAmount;
};
