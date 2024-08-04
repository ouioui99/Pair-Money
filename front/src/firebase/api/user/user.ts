import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../../firebase.js";

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

export const initialAuthentication = (): Promise<User> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        resolve(user);
      }
    });
  });
};

export const logout = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};
