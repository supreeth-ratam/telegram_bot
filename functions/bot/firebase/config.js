const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const {
  getDocs,
  collection,
  addDoc,
  query,
  where,
} = require("firebase/firestore");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "sura-39f48.firebaseapp.com",
  projectId: "sura-39f48",
  storageBucket: "sura-39f48.appspot.com",
  messagingSenderId: "505593552178",
  appId: "1:505593552178:web:a6f71c6ab27b180273cb2b",
  measurementId: "G-9EVBL3Y37X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("database connected");

const showAllDocs = async () => {
  const querySnapshot = await getDocs(collection(db, "media"));
  querySnapshot.forEach((doc) => console.log(doc.data()));
};

const addMedia = async (data) => {
  try {
    const queryRef = collection(db, "media");
    const q = query(
      queryRef,
      where("id", "==", data.id),
      where("type", "==", "movie")
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Already added");
      return true;
    }
    const docRef = await addDoc(collection(db, "media"), data);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

const data = {
  title: "Hi Nanna",
  year: 2023,
  id: 1068452,
  poster: "/hhMLtq9m1aK0dpY9Wcq26XeDH2z.jpg",
  type: "movie",
};

// addMedia(data);
// showAllDocs();

module.exports = { addMedia };
