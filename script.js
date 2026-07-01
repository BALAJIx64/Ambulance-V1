import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
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
let currentLatitude = 0;
let currentLongitude = 0;
function getLocation() {

    if (navigator.geolocation) {

       navigator.geolocation.getCurrentPosition(showPosition, showError);

    } else {

        alert("Geolocation is not supported.");

    }

}

async function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById("gpsStatus").innerHTML =
"📍 GPS detected successfully";
    currentLatitude = lat;
currentLongitude = lon;

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    const hospitalDropdown = document.getElementById("hospitalName");
    hospitalDropdown.innerHTML = "";

    const snapshot = await getDocs(collection(db, "hospitals"));

    const hospitals = [];

snapshot.forEach((doc) => {

    const hospital = doc.data();

    const distance = Math.sqrt(
        Math.pow(lat - hospital.latitude, 2) +
        Math.pow(lon - hospital.longitude, 2)
    );

    hospitals.push({
    id: doc.id,
    ...hospital,
    distance
});

});
window.nearbyHospitals = hospitals;

hospitals.sort((a, b) => a.distance - b.distance);
window.nearbyHospitals = hospitals;

hospitals
.filter(hospital => hospital.distance * 111 <= 10)
.forEach((hospital) => {

    const option = document.createElement("option");

    option.value = hospital.id;
option.textContent =
`${hospital.englishName} (${hospital.tamilName}) - ${(hospital.distance * 111).toFixed(1)} km`;


    if (hospitalDropdown.options.length === 0) {
    option.selected = true;
}

hospitalDropdown.appendChild(option);

});

}
function showError(error) {

    document.getElementById("gpsStatus").innerHTML =
    "❌ Unable to detect GPS location";

    console.log(error);

}
function startAmbulanceMovement(patientId) {

    setInterval(async () => {

        currentLatitude += 0.00005;
        currentLongitude += 0.00005;

        await updateDoc(doc(db, "patients", patientId), {

            latitude: currentLatitude,
            longitude: currentLongitude

        });

    }, 3000);

}
window.submitData = async function () {

  const patientName = document.getElementById("patientName").value;
  const riskLevel = document.getElementById("riskLevel").value;
 const hospitalId = document.getElementById("hospitalName").value;
const selectedHospital = window.nearbyHospitals.find(
    hospital => hospital.id === hospitalId
);
  try {
const selectedHospital = window.nearbyHospitals.find(
    h => h.id === hospitalId
);
    await addDoc(collection(db, "patients"), {
    patientName: patientName,
    riskLevel: riskLevel,
    hospitalId: hospitalId,

    latitude: currentLatitude,
    longitude: currentLongitude,

    hospitalLatitude: selectedHospital.latitude,
    hospitalLongitude: selectedHospital.longitude,
    hospitalEnglishName: selectedHospital.englishName,
     hospitalTamilName: selectedHospital.tamilName,


    createdAt: new Date().toISOString()
});

    const popup = document.getElementById("successPopup");
const message = document.getElementById("successMessage");

message.innerHTML = `
<b>${patientName}</b><br>
Hospital Assigned Successfully
`;

popup.classList.add("show");

setTimeout(() => {
    popup.classList.remove("show");
},3000);

  } catch (error) {

    console.error(error);
    alert("Error saving patient data!");

  }
}
getLocation();