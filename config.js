// Smart Farm Assistant Configuration
window.FARM_CONFIG = {
  DB_URL: "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com",            // e.g. "https://your-project-default-rtdb.firebaseio.com"
  DB_PATH: "field",      // e.g. "field_x7k2q9"
  DATA_GOV_API_KEY: "579b464db66ec23bdd0000017f522ce4766940ac7adffdacc85d15ab",
  MANDI_RESOURCE_ID: "9ef84268-d588-465a-a308-a864a43d0070",

  // Firebase Web Client Config (from Firebase Console > Project Settings > General > Your apps > Web app)
  // Used in browser for Firebase Google Sign-In
  FIREBASE: {
    apiKey: "AIzaSyCJ5Qfb9hs01YhNbHy9K1931PUB1GpnUYs",
    authDomain: "smart-farm-assistant-32782.firebaseapp.com",
    projectId: "smart-farm-assistant-32782",
    storageBucket: "smart-farm-assistant-32782.firebasestorage.app",
    messagingSenderId: "1019263301303",
    appId: "1:1019263301303:web:eaa17e134be29baa6cff32",
    databaseURL: "https://smart-farm-assistant-32782-default-rtdb.firebaseio.com"
  },

  // Razorpay Public Key ID (rzp_test_... or rzp_live_...)
  // Safe to be public; will also be loaded automatically from /api/create-order
  RAZORPAY_KEY_ID: ""
};
