import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore/lite";
import { getFirebaseConfig } from "../firebaseConfig.js";
import { pubsub } from "./pubsub";

export const firebaseControlsFunctions = (() => {
  const _authStateObserver = (user) => {
    if (user) {
      console.log("user is logged in");
      console.log(user);
    } else {
      console.log("user is not logged in");
    }
  };

  const firebaseSetup = () => {
    const firebaseAppConfig = getFirebaseConfig();
    initializeApp(firebaseAppConfig);

    onAuthStateChanged(getAuth(), _authStateObserver);
    console.log("firebase setup triggered");
  };
  pubsub.subscribe("prePageLoad", firebaseSetup);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider);
    } catch (error) {
      console.log("sign in error: " + error);
    }
  };
  pubsub.subscribe("triggerGoogleSignIn", googleSignIn);

  const googleSignOut = async () => {
    try {
      signOut(getAuth());
    } catch (error) {
      console.log("sign out error: " + error);
    }
  };
  pubsub.subscribe("triggerGoogleSignOut", googleSignOut);
})();

// async function saveTask(messageText) {
//   // Add a new message entry to the Firebase database.
//   try {
//     await addDoc(collection(getFirestore(), "tasks"), {
//       title: "Title Here",
//       description: "description here",
//       dueDate: "04/19/2023",
//       priority: "low",
//       project: "Default",
//       status: "incomplete",
//       timestamp: serverTimestamp(),
//     });
//   } catch (error) {
//     console.error("Error writing new message to Firebase Database", error);
//   }
// }

// console.log(app);
// console.log(db);

// saveTask();

// console.log(getAuth());

// const googleSignIn = async () => {
//   try {
//     const provider = new GoogleAuthProvider();
//     signInWithPopup(getAuth(), provider);
//   } catch (error) {
//     console.log("sign in error: " + error);
//   }
// };

// document.getElementById("sign-in").addEventListener("click", googleSignIn);

// const googleSignOut = async () => {
//   try {
//     signOut(getAuth());
//   } catch (error) {
//     console.log("sign out error: " + error);
//   }
// };

// document.getElementById("sign-out").addEventListener("click", googleSignOut);

// onAuthStateChanged((user) => {
//   if (user) {
//     console.log("user is signed in");
//     return;
//   }

//   console.log("user is signed out");
// });
