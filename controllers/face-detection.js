require('dotenv').config();
const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
});

const detectFaces = (req, res) => {
	const { url } = req.body;
    clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL, url)
      .then(response => res.json(response.outputs[0].data))
      .catch(err => res.status(400).json("Error: face detection unsuccessful"))
}

const handleEntries = (db) => (req, res) => {
	const { id } = req.body;
	db("users")
	  .returning("entries")
	  .where("id", id)
	  .increment({ entries: 1 })
	  .then(entries => {
	  	entries[0]
	  	? res.json(+entries[0])
	  	: res.status(400).json("Error: entry not added")
	  })
}

module.exports = {
	detectFaces,
	handleEntries
}