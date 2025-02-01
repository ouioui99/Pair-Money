import { useState } from "react";

type AlertType = "success" | "error";

interface AlertState {
  message: string;
  type: AlertType;
}

export default function useAlert() {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type });
  };

  const clearAlert = () => setAlert(null);

  return { alert, showAlert, clearAlert };
}
