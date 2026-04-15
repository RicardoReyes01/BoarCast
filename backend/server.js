const express = require("express");
const cors = require("cors");

// Pull in both db (Firestore) and auth (Firebase Auth) from firebase.js
const { db, auth } = require("./firebase");

const app = express();

// Allow requests from the Expo app (different origin/port)
app.use(cors());

// Automatically parse incoming JSON request bodies into req.body
app.use(express.json());


// ─────────────────────────────────────────────
// MIDDLEWARE: verifyToken
// Purpose: Protect routes so only logged-in users can access them
//
// How it works:
//   1. Grabs the token from the Authorization header
//   2. Asks Firebase Admin to verify it's real and not expired
//   3. If valid — attaches the decoded user info to req.user and calls next()
//      next() means "okay this request is good, go run the actual route now"
//   4. If invalid or missing — blocks the request and sends back a 401
//
// Usage: add "verifyToken" as a second argument to any route you want to protect
//   e.g.  app.get("/me", verifyToken, async (req, res) => { ... })
// ─────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  try {
    // The Authorization header looks like: "Bearer eyJhbGciOiJSUzI1NiIsI..."
    // We grab the whole header first
    const authHeader = req.headers.authorization;

    // If there's no Authorization header at all, block the request immediately
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Split "Bearer <token>" and grab just the token part (index 1)
    const token = authHeader.split(" ")[1];

    // Ask Firebase Admin to verify the token
    // If it's valid, Firebase decodes it and gives us the user's info
    // If it's expired or fake, Firebase throws an error and we jump to catch{}
    const decodedToken = await auth.verifyIdToken(token);

    // Attach the decoded user info to the request object
    // This makes req.user available inside any route that uses this middleware
    // The most important field is req.user.uid — the logged in user's unique ID
    req.user = decodedToken;

    // Token is valid — tell Express to continue on to the actual route handler
    next();

  } catch (error) {
    // Token was missing, expired, or tampered with — block the request
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


// ─────────────────────────────────────────────
// ROUTE: POST /register
// Purpose: Create a brand new user account
//
// The app sends:  { name, email, password }
// The server:     1. Creates a login in Firebase Auth
//                 2. Writes a profile document to Firestore
// The server returns: { uid } on success
// ─────────────────────────────────────────────
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation — make sure none of the fields are missing
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Step 1: Create the user login in Firebase Auth
    // This stores the email + password and generates a unique uid for this user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // Step 2: Write the user's profile to Firestore
    // Firebase Auth only knows email/password — everything else lives here
    await db.collection("users").doc(uid).set({
      uid,
      name,
      email,
      role: "student",       // default role — admins get changed manually in Firebase console
      createdAt: new Date(),
      rsvps: [],             // will hold event IDs they RSVP to later
    });

    res.status(201).json({ uid });

  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ error: "An account with that email already exists" });
    }
    if (error.code === "auth/invalid-password") {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});


// ─────────────────────────────────────────────
// ROUTE: GET /me
// Purpose: Return the currently logged-in user's profile
// This is what your partner's account info screen will call to get the user's data
//
// Protected by verifyToken — the app must send a valid token in the header
// The server already knows WHO is asking because verifyToken decoded the token
// and put their uid on req.user.uid — no need to pass an ID in the URL
//
// The app sends:  Authorization header with token
// The server returns: that user's Firestore profile object
// ─────────────────────────────────────────────
app.get("/me", verifyToken, async (req, res) => {
  try {
    // req.user.uid was attached by verifyToken — it's the logged-in user's uid
    const uid = req.user.uid;

    // Look up their profile document in Firestore
    const doc = await db.collection("users").doc(uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Send back their full profile (name, email, role, rsvps, etc.)
    res.json(doc.data());

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// UPDATE CURRENT USER PROFILE
app.put("/me", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const { name, bio, isPublic } = req.body;

    await db.collection("users").doc(uid).update({
      name,
      bio,
      isPublic,
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// GET ANY USER BY ID
app.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const doc = await db.collection("users").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).send("User not found");
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).send("Server error");
  }
});


// PLACEHOLDER: USER EVENTS
app.get("/me/events", verifyToken, async (req, res) => {
  res.json([]);
});


// PLACEHOLDER: USER BADGES
app.get("/me/badges", verifyToken, async (req, res) => {
  res.json([]);
});


// ─────────────────────────────────────────────
// ROUTE: POST /broadcast
// Purpose: Create a new broadcast (event announcement) in Firestore
// Protected by verifyToken — only logged-in users can post
//
// The app sends:  { message } + Authorization header with token
// The server returns: { id } — the new document's Firestore ID
// ─────────────────────────────────────────────
app.post("/broadcast", verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    // We get createdBy from the token now instead of trusting the app to send it
    // This is more secure — the app can't fake who posted something
    const createdBy = req.user.uid;

    const docRef = await db.collection("broadcasts").add({
      message,
      createdBy,
      createdAt: new Date(),
    });

    res.status(200).json({ id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating broadcast");
  }
});


// ─────────────────────────────────────────────
// ROUTE: GET /broadcasts
// Purpose: Fetch all broadcasts and send them to the app
// Public route — no token needed, anyone can view broadcasts
//
// The app sends:  nothing
// The server returns: array of all broadcast objects, newest first
// ─────────────────────────────────────────────
app.get("/broadcasts", async (req, res) => {
  try {
    const snapshot = await db.collection("broadcasts")
      .orderBy("createdAt", "desc")
      .get();

    const broadcasts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(broadcasts);
  } catch (error) {
    res.status(500).send("Error fetching broadcasts");
  }
});


// ─────────────────────────────────────────────
// ROUTE: GET /user/:id
// Purpose: Fetch any user's profile by their uid
// Protected by verifyToken — must be logged in to look up users
//
// The app sends:  uid in the URL + Authorization header with token
// The server returns: that user's profile object
// ─────────────────────────────────────────────
app.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      return res.status(404).send("User not found");
    }

    res.json(doc.data());
  } catch (error) {
    res.status(500).send("Server error");
  }
});


//error handling  
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: err.message });
});

// ─────────────────────────────────────────────
// Start the server on port 5000
// ─────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: err.message });
});