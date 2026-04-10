// firebase-admin is the server-side Firebase SDK
// It gives your backend full admin access to your Firebase project
const admin = require("firebase-admin");

// Your service account key is a JSON file that acts as your credentials
// It proves to Google that this server is allowed to access your Firebase project
const serviceAccount = process.env.SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.SERVICE_ACCOUNT_KEY)
  : require("./serviceAccountKey.json");

// initializeApp boots up the Firebase connection using those credentials
// This only needs to happen once when the server starts
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// admin.firestore() gives us a reference to the Firestore database
// Think of "db" as the door handle to your database —
// you use it any time you want to read or write data
const db = admin.firestore();

// auth is your handle to Firebase Authentication (handles creating/verifying user logins)
const auth = admin.auth();


// We export db so that other files (like server.js) can import it and use it
// Without this line, db would be stuck inside this file and nothing else could use it
// Export both so other files can import whichever they need
module.exports = { db, auth };
 



















