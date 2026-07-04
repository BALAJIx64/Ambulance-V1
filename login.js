import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
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

window.login = async function () {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));

        if (!userDoc.exists()) {

    alert("User not found.");

    return;

}

const role = userDoc.data().role;

localStorage.setItem("uid", uid);
localStorage.setItem("role", role);

if (role === "admin") {

    window.location.href = "admin-dashboard.html";

}

else if (role === "hospital") {

    window.location.href = "hospital-dashboard.html";

}

else if (role === "driver") {

    window.location.href = "index.html";

}

else {

    alert("Invalid user role.");

}

    }

    catch (error) {

        alert(error.message);

    }

}