const config = {
  apiKey: "AIzaSyDWtNyJ-sSNPp_UbMm1utDkJINel9AKWLA",
  authDomain: "todo-list-77ea3.firebaseapp.com",
  projectId: "todo-list-77ea3",
  storageBucket: "todo-list-77ea3.appspot.com",
  messagingSenderId: "15501215053",
  appId: "1:15501215053:web:c4bbafaf8d32b9ee046304",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    console.log("got config");
    return config;
  }
}
