import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1FwfCC4VS8PX8rhhT_B06TDS2E3WvkJ4",
  authDomain: "expense-tracker-2c1b3.firebaseapp.com",
  projectId: "expense-tracker-2c1b3",
  storageBucket: "expense-tracker-2c1b3.firebasestorage.app",
  messagingSenderId: "974311911802",
  appId: "1:974311911802:web:2537acab974456426c66c3",
  measurementId: "G-WDJSYFZE4E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
