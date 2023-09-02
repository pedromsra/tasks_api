const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

authSecret = process.env.authSecret

module.exports = app => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Dados incompletos')
    }

    const user = await app.db('users')
      .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
      .first()

    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).send('Email ou senha inválida')
        }

        const payload = { id: user.id }

        return res.json({
          name: user.name,
          email: user.email,
          token: jwt.encode(payload, authSecret)
        })
      })
    } else {
      return res.status(400).send('Email ou senha inválida')
    }
  }

  return { signin }
}
