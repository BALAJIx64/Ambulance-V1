import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy,
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
const db = getFirestore(app);
// Initialize OpenStreetMap
const map = L.map("map").setView([11.0168, 76.9558], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);
// Ambulance marker
let ambulanceMarker = null;
let hospitalMarker = null;
let routingControl = null;
const allPatients = {};
const ambulanceIcon = L.icon({

    iconUrl: "images/ambulance.png",

    iconSize: [45, 45],

    iconAnchor: [22, 22],

    popupAnchor: [0, -20]

});
const currentHospitalId = localStorage.getItem("hospitalId");

console.log("Hospital ID:", currentHospitalId);

const hospitalDoc = await getDoc(doc(db, "hospitals", currentHospitalId));

console.log("Exists:", hospitalDoc.exists());

if (hospitalDoc.exists()) {

    const hospital = hospitalDoc.data();

    console.log(hospital);

    document.getElementById("welcomeHospital").textContent =
        hospital.englishName;

}
console.log("Current Hospital:", currentHospitalId);

const patientList = document.getElementById("patientList");
const totalPatients = document.getElementById("totalPatients");
const criticalPatients = document.getElementById("criticalPatients");
const highPatients = document.getElementById("highPatients");
const lowPatients = document.getElementById("lowPatients");
const notificationBox = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");
const notificationSound = new Audio("mixkit-doorbell-tone-2864.wav");
let audioUnlocked = false;

document.addEventListener("click", () => {
    if (!audioUnlocked) {
        notificationSound.play()
            .then(() => {
                notificationSound.pause();
                notificationSound.currentTime = 0;
                audioUnlocked = true;
                console.log("Audio unlocked");
            })
            .catch(err => console.log(err));
    }
}, { once: true });
let previousPatientCount = 0;
const q = query(
    collection(db, "patients"),
    orderBy("createdAt", "desc")
);
function showPatientRoute(patient) {

    // Remove old route
    if (routingControl) {
        routingControl.remove();
        routingControl = null;
    }

    // Draw new route
    routingControl = L.Routing.control({

    waypoints: [
        L.latLng(patient.latitude, patient.longitude),
        L.latLng(patient.hospitalLatitude, patient.hospitalLongitude)
    ],

    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    show: false

})
.on('routesfound', function(e){
console.log("Route Found!");
    const route = e.routes[0];

    const distance =
        (route.summary.totalDistance/1000).toFixed(2);

    const time =
        Math.round(route.summary.totalTime/60);

    console.log("Updating patient info...");

const info = document.getElementById("patientInfo");

info.innerHTML = `
        <h3>🚑 Selected Ambulance</h3>

        <p><b>Patient:</b> ${patient.patientName}</p>

        <p><b>Risk:</b> ${patient.riskLevel}</p>

        <p><b>Hospital:</b> ${patient.hospitalEnglishName}</p>

        <p><b>📏 Distance:</b> ${distance} km</p>

        <p><b>⏱ ETA:</b> ${time} min</p>

        <p><b>Status:</b> 🟢 En Route</p>
    `;
console.log(info.innerHTML);
})

.addTo(map);

}
onSnapshot(q, (snapshot) => {

    patientList.innerHTML = "";

    let total = 0;
    let critical = 0;
    let high = 0;
    let low = 0;
let firstLoad = patientList.innerHTML === "";
let latestPatient = null;
    snapshot.forEach((doc) => {

        const patient = doc.data();
        allPatients[doc.id] = patient;
        latestPatient = patient;

        if (patient.hospitalId !== currentHospitalId) {
            return;
        }
        // Show ambulance location on map

console.log(patient);
console.log("Latitude:", patient.latitude);
console.log("Longitude:", patient.longitude);
if (
    typeof patient.latitude === "number" &&
    typeof patient.longitude === "number"
) {

    if (ambulanceMarker && map.hasLayer(ambulanceMarker)) {
    map.removeLayer(ambulanceMarker);
}

    ambulanceMarker = L.marker(
    [patient.latitude, patient.longitude],
    {
        icon: ambulanceIcon
    }
).addTo(map);
if (
    patient.hospitalLatitude !== undefined &&
    patient.hospitalLongitude !== undefined
) {

    if (hospitalMarker && map.hasLayer(hospitalMarker)) {
    map.removeLayer(hospitalMarker);
}

    hospitalMarker = L.marker([
        patient.hospitalLatitude,
        patient.hospitalLongitude
    ]).addTo(map);

    hospitalMarker.bindPopup(`
        🏥 <b>${patient.hospitalEnglishName}</b>
    `);

}
/*if (routingControl) {
    routingControl.remove();
    routingControl = null;
}

routingControl = L.Routing.control({

    waypoints: [

        L.latLng(patient.latitude, patient.longitude),

        L.latLng(
            patient.hospitalLatitude,
            patient.hospitalLongitude
        )

    ],

    routeWhileDragging: false,

    addWaypoints: false,

    draggableWaypoints: false,

    fitSelectedRoutes: true,

    show: false

}).addTo(map);*/
ambulanceMarker.bindPopup(`
        🚑 <b>${patient.patientName}</b><br>
        Risk: ${patient.riskLevel}
    `);
    
    map.setView([patient.latitude, patient.longitude], 15);

}

        total++;

        if (patient.riskLevel === "Critical") critical++;
        if (patient.riskLevel === "High") high++;
        if (patient.riskLevel === "Low") low++;

       patientList.innerHTML += `
    <div class="patient-card ${patient.riskLevel.toLowerCase()}"
         data-id="${doc.id}">

        <div class="riskBadge">
            ${patient.riskLevel}
        </div>

        <h3>🚑 ${patient.patientName}</h3>

        <p><b>Hospital:</b> ${patient.hospitalId}</p>

    </div>
`;
    });
    snapshot.docChanges().forEach((change) => {

    if (
        change.type === "added" &&
        previousPatientCount !== 0
    ) {

        const newPatient = change.doc.data();

        if (newPatient.hospitalId !== currentHospitalId) return;

        if (audioUnlocked) {
            notificationSound.currentTime = 0;
            notificationSound.play();
        }

        notificationText.innerHTML = `
            <b>Patient:</b> ${newPatient.patientName}<br>
            <b>Risk:</b> ${newPatient.riskLevel}
        `;

        notificationBox.classList.add("show");

        setTimeout(() => {
            notificationBox.classList.remove("show");
        }, 4000);
    }

});


    totalPatients.textContent = total;
    criticalPatients.textContent = critical;
    highPatients.textContent = high;
    lowPatients.textContent = low;
   previousPatientCount = total;
document.querySelectorAll(".patient-card").forEach(card => {

    card.addEventListener("click", () => {

        const patientId = card.dataset.id;

const patient = allPatients[patientId];

showPatientRoute(patient);

    });

});



});