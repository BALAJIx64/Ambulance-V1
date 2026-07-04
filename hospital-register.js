import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase Config
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

let hospitalLatitude = 0;
let hospitalLongitude = 0;
function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);

    } else {

        alert("Geolocation is not supported.");

    }

}

function showPosition(position) {

    hospitalLatitude = position.coords.latitude;
    hospitalLongitude = position.coords.longitude;

    console.log("Hospital Latitude:", hospitalLatitude);
    console.log("Hospital Longitude:", hospitalLongitude);

}

getLocation();
window.registerHospital = async function () {

    const englishName =
        document.getElementById("englishName").value;

    const tamilName =
        document.getElementById("tamilName").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const contact =
        document.getElementById("contact").value;

    try {

        // 1. Create Firebase Authentication Account
const userCredential = await createUserWithEmailAndPassword(

    auth,

    email,

    password

);

// 2. Get the Firebase UID
const uid = userCredential.user.uid;

// 3. Save Hospital Details in Firestore
// 3. Create user role document
await setDoc(doc(db, "users", uid), {

    role: "hospital"

});

// 4. Save Hospital Details
await setDoc(doc(db, "hospitals", uid), {

    englishName,

    tamilName,

    email,

    contact,

    latitude: hospitalLatitude,

    longitude: hospitalLongitude,

    status: "Pending",

    createdAt: new Date().toISOString()

});

alert("Hospital Registered Successfully!");
    }

    catch (error) {

        console.error(error);

        alert("Registration Failed!");

    }

}