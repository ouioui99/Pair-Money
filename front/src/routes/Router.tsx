import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";
import FixedCostsList from "../pages/FixedCostsList";
import Mypage from "../pages/Mypage";
import ReceiptScanning from "../pages/ReceiptScanning";
import SpendingIndex from "../pages/SpendingIndex";
import SpendingType from "../pages/SpendingType";
import MemberList from "../pages/MemberList";
import Group from "../pages/Group";

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
              <SpendingType />
            </PrivateRouter>
          }
        />
        <Route
          path="/mypage"
          element={
            <PrivateRouter>
              <Mypage />
            </PrivateRouter>
          }
        />
        <Route
          path="/receipt-scanning"
          element={
            <PrivateRouter>
              <ReceiptScanning />
            </PrivateRouter>
          }
        />
        <Route
          path="/spending-index"
          element={
            <PrivateRouter>
              <SpendingIndex />
            </PrivateRouter>
          }
        />
        <Route
          path="/fixed-costs-list"
          element={
            <PrivateRouter>
              <FixedCostsList />
            </PrivateRouter>
          }
        />
        <Route
          path="/member-list"
          element={
            <PrivateRouter>
              <MemberList />
            </PrivateRouter>
          }
        />
        <Route
          path="/group"
          element={
            <PrivateRouter>
              <Group />
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
