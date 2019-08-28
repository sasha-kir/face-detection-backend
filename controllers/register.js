const bcrypt = require('bcrypt');
const saltRounds = 10;

const handleRegister = (db) => (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password, saltRounds);
	db.transaction(trx => {
		trx
		  .insert({
			email: email,
			hash: hash
		  })
		  .into("login")
		  .returning("email")
		  .then(loginEmail => {
		  	return trx("users")
	  		  .returning('*')
	  		  .insert({
				  name: name,
				  email: loginEmail[0],
				  joined: new Date()
	  		  })
	  		  .then(user => {
	  			  res.json(user[0]);
		  	  })
		   })
		  .then(trx.commit)
		  .catch(trx.rollback)
	})
	  .catch(err => res.status(400).json("Error: User not created"))
};

module.exports = {
	handleRegister
};