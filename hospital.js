import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy
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

const patientList = document.getElementById("patientList");
const currentHospitalId = localStorage.getItem("hospitalId");

const q = query(
    collection(db, "patients"),
    orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {

    patientList.innerHTML = "";

    snapshot.forEach((doc) => {
        const patient = doc.data();

if (patient.hospitalId !== currentHospitalId) {
    return;
}

     

        patientList.innerHTML += `
    <div class="patient-card ${patient.riskLevel.toLowerCase()}">
        <h3>👤 ${patient.patientName}</h3>
        <p><b>Risk:</b> ${patient.riskLevel}</p>
        <p><b>Hospital:</b> ${patient.hospitalId}</p>
    </div>
`;

    });

});