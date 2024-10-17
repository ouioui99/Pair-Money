import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContextProvider";
import { useContext } from "react";

type Props = {
  children?: React.ReactNode;
};

const PublicRouter: React.FC<Props> = ({ children }) => {
  const userContext = useContext(UserContext);

  // 権限がない場合、渡されたこのポーネントをレンダリング
  // ※ ログインページとユーザ新規登録ページに適用
  if (userContext && !userContext.user) {
    return children;
  } else {
    return <Navigate to="/"></Navigate>;
  }
};

export default PublicRouter;
