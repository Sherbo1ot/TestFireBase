const { async } = require("@firebase/util");
const { response } = require("express");
const express = require("express");
const app = express();

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    const response = await db.collection("users").add(userJson);
    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

app.get("/read/all", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.get();
    let responseArr = [];

    response.forEach((doc) => {
      responseArr.push(doc.data());
    });

    res.send(responseArr);
  } catch (err) {
    console.log(err);
  }
});

app.get("/read/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();

    res.send(response.data());
  } catch (err) {
    console.log(err);
  }
});

app.post("/update", async (req, res) => {
  try {
    const id = req.body.id;
    const newFirstName = "Stephen";
    const userRef = await db.collection("users").doc(id).update({
      firstName: newFirstName,
    });

    res.send(userRef);
  } catch (err) {
    res.send(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const response = await db.collection("users").doc(req.params.id).delete();

    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
