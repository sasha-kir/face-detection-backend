const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");

const register = require("./controllers/register.js");
const signIn = require("./controllers/sign-in.js");
const faceDetection = require("./controllers/face-detection.js");

const db = knex({
  client: "pg",
  connection: {
    host : "127.0.0.1",
    user : "sasha_kir",
    password : "",
    database : "face-recognition-app"
  }
});

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	db.select().from("users")
	  .then(data => res.json(data));
})

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	db("users")
	  .where("id", id)
	  .then(user => {
	  	user[0]
	  	? res.json(user[0])
	  	: res.status(404).json("Error: user not found")
	  });
})

app.post("/detect", faceDetection.detectFaces)

app.put("/new-entry", faceDetection.handleEntries(db))

app.post("/sign-in", signIn.handleSignIn(db))

app.post("/register", register.handleRegister(db))

app.listen(port, () => {
	console.log(`Face detection backend is running on port ${port}`)
})
