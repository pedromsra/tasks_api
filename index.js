const express = require('express')
const app = express()
const consign = require('consign')

consign()
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./api')
  .then('./config/routes.js')
  .into(app)

app.listen(3000, () => {
  console.log('Backend executando...')
})