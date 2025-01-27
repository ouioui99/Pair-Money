import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { initialAuthentication } from "../firebase/api/user/user";
import { FUser } from "../types";
import { getData } from "../firebase/firestore";

type Props = {
  children?: React.ReactNode;
};

type Context = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userData: FUser | null;
  setUserData: React.Dispatch<React.SetStateAction<FUser | null>>;
  loading: boolean;
};

export const UserContext = createContext<Context | null>(null);

const UserContextProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FUser | null>(null);
  const [loading, setLoading] = useState(false);

  const value: Context = {
    user,
    setUser,
    userData,
    setUserData,
    loading,
  };

  useEffect(() => {
    setLoading(true);

    initialAuthentication().then(async (user) => {
      setUser(user);
      if (user) {
        const userData = await getData<FUser>("users", {
          subDoc: "uid",
          is: "==",
          subDocCondition: user.uid,
        });
        setUserData(userData[0]);
      }

      setLoading(false);
    });
  }, []);

  return !loading ? (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  ) : (
    <></>
  );
};

export default UserContextProvider;
