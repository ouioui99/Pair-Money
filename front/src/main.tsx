import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./routes/Router";
import UserContextProvider from "./contexts/UserContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  </React.StrictMode>
);
