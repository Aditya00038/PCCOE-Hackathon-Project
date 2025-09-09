import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtV0D5Xe7xymcAM9SI0nf-BiYn-CvbAMY",
  authDomain: "pccoe-6ed7a.firebaseapp.com",
  projectId: "pccoe-6ed7a",
  storageBucket: "pccoe-6ed7a.appspot.com",
  messagingSenderId: "72470843743",
  appId: "1:72470843743:web:9a6a9a8aa5d728be87e6ea"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
