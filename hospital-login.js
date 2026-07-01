import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfsR3nM8E594k9BjRh-LSKmlXM57LF8Hs",
  authDomain: "ambulance-alert-system-62998.firebaseapp.com",
  projectId: "ambulance-alert-system-62998",
  storageBucket: "ambulance-alert-system-62998.firebasestorage.app",
  messagingSenderId: "129246064297",
  appId: "1:129246064297:web:7f1bd1605bfd41c00943b8",
  measurementId: "G-3N5WW3RHZE"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);
window.loginHospital = async function () {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const userCredential =
    await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

const uid = userCredential.user.uid;

// Find hospital document using UID
const q = query(
    collection(db, "hospitals"),
    where("uid", "==", uid)
);

const snapshot = await getDocs(q);

if (snapshot.empty) {

    alert("Hospital not found!");

    return;

}

const hospitalDoc = snapshot.docs[0];

// Save hospitalId
localStorage.setItem("hospitalId", hospitalDoc.id);

alert("Login Successful!");

window.location.href = "hospital-dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

}