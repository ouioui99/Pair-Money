import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";
import CustomBottomNavigation from "../components/CustomBottomNavigation";
import SpendingSummary from "../pages/SpendingSummary";
import FixedCostsList from "../pages/FixedCostsList";
import Mypage from "../pages/Mypage";
import ReceiptScanning from "../pages/ReceiptScanning";
import SpendingIndex from "../pages/SpendingIndex";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRouter>
              <Home />
            </PrivateRouter>
          }
        />
        <Route
          path="/spending-summary"
          element={
            <PrivateRouter>
              <SpendingSummary />
              <CustomBottomNavigation />
            </PrivateRouter>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRouter>
              <Mypage />
              <CustomBottomNavigation />
            </PrivateRouter>
          }
        />
        <Route
          path="/receipt-scanning"
          element={
            <PrivateRouter>
              <ReceiptScanning />
              {/* <CustomBottomNavigation /> */}
            </PrivateRouter>
          }
        />
        <Route
          path="/spending-index"
          element={
            <PrivateRouter>
              <SpendingIndex />
              <CustomBottomNavigation />
            </PrivateRouter>
          }
        />
        <Route
          path="/fixed-costs-list"
          element={
            <PrivateRouter>
              <FixedCostsList />
              <CustomBottomNavigation />
            </PrivateRouter>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRouter>
              <Login />
            </PublicRouter>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRouter>
              <Signup />
            </PublicRouter>
          }
        />
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
