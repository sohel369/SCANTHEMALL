// Import Firebase modules (v10 modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBb4q5dU4ccoRtK_c98chs1BMXoqcC222g",
    authDomain: "scanthemall-c1475.firebaseapp.com",
    databaseURL: "https://scanthemall-c1475-default-rtdb.firebaseio.com",
    projectId: "scanthemall-c1475",
    storageBucket: "scanthemall-c1475.appspot.com",
    messagingSenderId: "1040707976422",
    appId: "1:1040707976422:web:883018fc54b7ac5c8f8f27",
    measurementId: "G-11LB2NBCGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Export modules
export { app, analytics, auth, database };