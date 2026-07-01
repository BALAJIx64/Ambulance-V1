import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    updateDoc
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
const db = getFirestore(app);
const hospitalList = document.getElementById("hospitalList");

onSnapshot(collection(db, "hospitals"), (snapshot) => {

    hospitalList.innerHTML = "";

    snapshot.forEach((documentData) => {

        const hospital = documentData.data();

        if (hospital.status !== "Pending")
            return;

        hospitalList.innerHTML += `

        <div class="hospital-card">

            <h3>${hospital.englishName}</h3>

            <p>${hospital.tamilName}</p>

            <p>${hospital.email}</p>

            <button onclick="approveHospital('${documentData.id}')">

                Approve

            </button>

        </div>

        `;

    });

});
window.approveHospital = async function(id){

    await updateDoc(

        doc(db,"hospitals",id),

        {

            status:"Approved"

        }

    );

    alert("Hospital Approved!");

}