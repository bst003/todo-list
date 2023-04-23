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
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  serverTimestamp,
  where,
  collectionGroup,
} from "firebase/firestore/lite";
import { getFirebaseConfig } from "../firebaseConfig.js";
import { pubsub } from "./pubsub";

import { format } from "date-fns";

/*

Things to Do
	- Don't allow submissions/editing/anything if user is not signed in
		- Hide everything if user isn't signed in?
		- Just add alert to necessary items? 
			- Add boolean var to domStuff for log in status. Use that for alerts
			- items
				- Add Task btn
				- All single task line items
				- Add Project btn
				- Delet Project btn
	- Retrieve ToDo's from the Database
	- Retrieve Projects from the Database

	- Submit ToDo's to Database
	- Submit Projects to Database

*/

export const firebaseControlsFunctions = (() => {
  const _authStateObserver = (user) => {
    if (user) {
      console.log("user is logged in");
      console.log(user);

      const userData = {
        name: user.displayName,
        pic: user.photoURL,
      };

      pubsub.publish("onGoogleSignIn", userData);
    } else {
      console.log("user is not logged in");
      pubsub.publish("onGoogleSignOut");
    }
  };

  const _retrieveTasks = async () => {
    console.log("retrieve tasks");
    const tasksQuery = query(collection(getFirestore(), "tasks"));
    console.log(tasksQuery);

    const tasksQuerySnapshot = await getDocs(tasksQuery);
    tasksQuerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      console.log(Date.parse(doc.data().dueDate));

      const formattedDate = format(
        Date.parse(doc.data().dueDate),
        "MM-dd-yyyy"
      );

      const taskData = {
        id: doc.data().id,
        title: doc.data().title,
        description: doc.data().description,
        date: formattedDate,
        priority: doc.data().priority,
        project: doc.data().project,
        status: doc.data().status,
        timestamp: doc.data().timestamp.toDate(),
      };

      console.log(taskData.status);
      console.log(taskData.timestamp);

      pubsub.publish("submitTask", taskData);
    });
  };

  const _retrieveProjects = async () => {
    console.log("retrieve projects");
    const projectsQuery = query(collection(getFirestore(), "projects"));
    console.log(projectsQuery);

    const projectsQuerySnapshot = await getDocs(projectsQuery);
    projectsQuerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      const projectData = {
        id: doc.data().id,
        title: doc.data().title,
        timestamp: doc.data().timestamp.toDate(),
      };

      console.log(projectData.timestamp);

      pubsub.publish("submitProject", projectData);
    });
  };

  const firebaseSetup = () => {
    const firebaseAppConfig = getFirebaseConfig();
    initializeApp(firebaseAppConfig);

    onAuthStateChanged(getAuth(), _authStateObserver);
    console.log("firebase setup triggered");

    _retrieveProjects();
    _retrieveTasks();

    // saveTask();

    console.log(getAuth());
  };
  pubsub.subscribe("prePageLoad", firebaseSetup);

  // Sign In/Our functions

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

// CRUD functions

async function saveTask(taskObj) {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "tasks"), {
      ...taskObj,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving task to Firebase Database", error);
  }
}
pubsub.subscribe("saveTaskToFirebase", saveTask);

async function deleteTask(taskObj) {
  try {
    const q = query(
      collection(getFirestore(), "tasks"),
      where("id", "==", taskObj.id)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      console.log(docSnap.id, " => ", docSnap.data());

      await deleteDoc(doc(getFirestore(), "tasks", docSnap.id));
    });
  } catch (error) {
    console.error("Error deleting task to Firebase Database", error);
  }
}
pubsub.subscribe("deleteTaskFromFirebase", deleteTask);

async function editTask(taskObj) {
  try {
    const q = query(
      collection(getFirestore(), "tasks"),
      where("id", "==", taskObj.id)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      console.log("updating:");
      console.log(docSnap.id, " => ", docSnap.data());

      await updateDoc(doc(getFirestore(), "tasks", docSnap.id), {
        id: taskObj.id,
        title: taskObj.title,
        description: taskObj.description,
        dueDate: taskObj.date,
        priority: taskObj.priority,
        project: taskObj.project,
        status: taskObj.status,
        timestamp: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error("Error deleting task to Firebase Database", error);
  }
}
pubsub.subscribe("editTaskInFirebase", editTask);

async function saveProject(projectObj) {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), "projects"), {
      ...projectObj,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving project to Firebase Database", error);
  }
}
pubsub.subscribe("saveProjectToFirebase", saveProject);
