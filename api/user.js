const bcrypt = require('bcrypt-nodejs')
const knex = require("../knex.js")

module.exports = app => {
  const getHash = (password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
    })
  }

  const save = (req, res) => {
    getHash(req.body.password, hash => {
      const password = hash
      // O Erro é que o Knex está tentando acessar uma db local, enquanto roda na nuvem... preciso criar um db na nuvem para referenciar a esse db!!!!
      knex('users')
      .insert({ name: req.body.name, email: req.body.email.toLowerCase(), password })
      .then(_ => res.status(204).send())
      .catch(err => res.status(500).json(err.data))

    })
  }

  return { save }
}
