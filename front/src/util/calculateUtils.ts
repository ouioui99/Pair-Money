import { CommonResponseData } from "../types";

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
