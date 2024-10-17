import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContextProvider";
import { Navigate } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const PrivateRouter: React.FC<Props> = ({ children }) => {
  const userContext = useContext(UserContext);

  if (userContext && userContext.user) {
    return children;
  } else {
    return <Navigate to="/login"></Navigate>;
  }
};

export default PrivateRouter;
