/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    console.log(currentUser);
    setUser(currentUser);

    if (currentUser && currentUser.displayName && currentUser.photoURL) {
      try {
        // Save user to the database
        await axiosPublic.post('/user', {
          email: currentUser.email,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          "teamId": null
        });

        // Get token and store on client
        const userInfo = { email: currentUser.email };
        const res = await axiosPublic.post("/jwt", userInfo);
        if (res.data.token) {
          localStorage.setItem("access-token", res.data.token);
        }
      } catch (error) {
        console.error("Error handling auth state:", error);
      }
    } else {
      // Remove token if no user is logged in
      localStorage.removeItem("access-token");
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, [axiosPublic]);


  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
