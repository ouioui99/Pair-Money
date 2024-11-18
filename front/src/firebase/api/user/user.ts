import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../config.js";

export const singup = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve(user);
      })
      .catch((error) => {
        reject({
          errorCode: error.code,
          errorMessage: error.message,
        });
      });
  });
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        resolve(user);
      })
      .catch((error) => {
        reject({
          errorCode: error.code,
          errorMessage: error.message,
        });
      });
  });
};

export const initialAuthentication = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

export const logout = () => {
  return new Promise((resolve) => {
    signOut(auth)
      .then(() => {
        resolve("");
      })
      .catch((error) => {
        resolve(error);
      });
  });
};
