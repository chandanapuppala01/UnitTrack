import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNj-cNKfekJB9ZrMIhPv7Aju9SsmrJ6QM",
  authDomain: "unittrack01.firebaseapp.com",
  projectId: "unittrack01",
  storageBucket: "unittrack01.firebasestorage.app",
  messagingSenderId: "669822663065",
  appId: "1:669822663065:web:6e6c9a8f14bae2c1d3bb08",
  measurementId: "G-727HT4305K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
