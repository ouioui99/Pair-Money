import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { initialAuthentication } from "../firebase/api/user/user";

type Props = {
  children?: React.ReactNode;
};

type Context = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

export const UserContext = createContext<Context | null>(null);

const UserContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const value: Context = {
    user,
    setUser,
    loading,
  };

  useEffect(() => {
    setLoading(true);

    initialAuthentication().then((user) => {
      setUser(user);
      setLoading(false);
      console.log("aaa");
    });
  }, []);

  return !loading ? (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  ) : (
    <></>
  );
};

export default UserContextProvider;
