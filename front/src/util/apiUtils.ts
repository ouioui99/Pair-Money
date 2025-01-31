interface transformResult {
  totalAmount?: number;
  error?: { title: string; message: string };
}

export const transformApiData = (apiData: any): transformResult => {
  const textAnnotations = apiData.textAnnotations;
  const numberAndConmaReg = /[0-9,]+/g;
  const totalAmountNumbersAndConmaList = [];

  const result: transformResult = {};

  if (typeof textAnnotations == "undefined") {
    result.error = {
      title: "文字の認識に失敗しました。",
      message: "再撮影を実施するか手入力してください",
    };
    return result;
  }

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

  const totalIntAmount = getIntAmount(totalAmountNumbersAndConmaList);

  addResult(totalIntAmount, result);

  return result;
};

const getIntAmount = (amountList: any[]) => {
  const intAmount = parseInt(amountList.join("").replace(",", ""), 10);
  return intAmount;
};

const addResult = (intAmount: number, result: transformResult): void => {
  if (isNaN(intAmount)) {
    result.error = {
      title: "合計の抽出に失敗しました。",
      message: "再撮影を実施するか手入力してください",
    };
  } else if (typeof intAmount) {
    result.totalAmount = intAmount;
  }
};
