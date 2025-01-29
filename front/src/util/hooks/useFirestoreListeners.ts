import { useRef, useEffect, useCallback } from "react";

type Listener = () => void;

export const useFirestoreListeners = () => {
  const unsubscribeList = useRef<Listener[]>([]);

  // リスナー追加関数をメモ化
  const addListener = useCallback((unsubscribe: Listener) => {
    unsubscribeList.current.push(unsubscribe);
  }, []);

  useEffect(() => {
    // アンマウント時にリスナーを解除
    return () => {
      unsubscribeList.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeList.current = [];
    };
  }, []);

  return { addListener };
};
