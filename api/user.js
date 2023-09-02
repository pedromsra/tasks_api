const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
  const getHash = (password, callback) => {
    console.log("OI")
    bcrypt.genSalt(10, (err, salt) => {
      console.log("Ola")
      bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
      console.log("nao foi eu")
    })
  }

  const save = (req, res) => {
    getHash(req.body.password, hash => {
      const password = hash
      
      app.db('users')
        .insert({ name: req.body.name, email: req.body.email.toLowerCase(), password })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).json(err))
    })
  }

  return { save }
}
