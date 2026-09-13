import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDHSiWR4ivK8l4WnmdnuiUNRsfiHWDAEXQ",
    authDomain: "apple-a-day-app.firebaseapp.com",
    projectId: "apple-a-day-app",
    storageBucket: "apple-a-day-app.firebasestorage.app",
    messagingSenderId: "777929016517",
    appId: "1:777929016517:web:01d411533043a85cba9cac",
};

export const app = initializeApp(firebaseConfig);