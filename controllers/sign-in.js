const bcrypt = require('bcrypt');
const saltRounds = 10;

const handleSignIn = (db) => (req, res) => {
	const { username, password } = req.body;
	db("login")
	  .where("email", username)
	  .select("hash")
	  .then(result => {
	  	if (result[0]) {
	  		const hash = result[0].hash;
	  		bcrypt.compare(password, hash)
	  	      .then(isMatching => { 
	  	      	if (isMatching) {
	  	      		db("users")
	  	      		  .where("email", username)
	  	      		  .then(user => res.json(user[0]));
	  	      	} else {
	  	      		res.status(400).json("Error: wrong username or password")
	  	      	}
	  	       });
	  	} else {
	  	    res.status(400).json("Error: wrong username or password")
	  	}
	  });
};

module.exports = {
	handleSignIn
}