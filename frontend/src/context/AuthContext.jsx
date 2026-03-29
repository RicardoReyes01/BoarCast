import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseFrontend";

// createContext makes a global "container" that any component in the app can reach into
// Think of it like a global variable but done the React way
const AuthContext = createContext(null);

// AuthProvider wraps your entire app and keeps track of who is logged in
// Any component inside it can call useAuth() to get the current user
export const AuthProvider = ({ children }) => {

  // currentUser holds the Firebase user object when logged in, or null when logged out
  const [currentUser, setCurrentUser] = useState(null);

  // loading is true while Firebase is figuring out if the user is already logged in
  // (e.g. they closed the app and reopened it — Firebase checks if their session is still valid)
  // We use this to avoid showing the login screen for a split second before Firebase responds
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a Firebase listener that fires whenever the auth state changes
    // - When a user signs in → called with the user object
    // - When a user signs out → called with null
    // - When the app first loads → called immediately with whoever is already signed in (or null)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);  // update our state with whoever Firebase says is logged in
      setLoading(false);     // Firebase has responded, we're no longer in the loading state
    });

    // Cleanup: when the AuthProvider unmounts, stop listening to auth changes
    // unsubscribe() is a function Firebase gives us to turn off the listener
    return unsubscribe;
  }, []);

  // logout signs the user out of Firebase and clears the session
  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will automatically fire with null after this
    // which sets currentUser to null and triggers the app to show the login screen
  };

  // getToken gets the current user's ID token to send to your backend
  // Your backend middleware (verifyToken) will check this token on protected routes
  const getToken = async () => {
    if (!currentUser) return null;
    // getIdToken() fetches a fresh token — passing true forces a refresh if it's expired
    return await currentUser.getIdToken(true);
  };

  // Everything we expose to the rest of the app via useAuth()
  const value = {
    currentUser,  // the Firebase user object (has .uid, .email, .displayName etc.)
    loading,      // whether Firebase is still checking the auth state
    logout,       // function to sign the user out
    getToken,     // function to get the ID token for backend requests
  };

  // Don't render anything until Firebase has checked the auth state
  // This prevents a flicker where the login screen shows briefly for already-logged-in users
  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth is a custom hook — any component can call this to get the auth context
// e.g. const { currentUser, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
