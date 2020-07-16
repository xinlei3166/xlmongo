const Mongo = require('../src/mongo')

const m = new Mongo({
  host: 'localhost',
  port: '27017',
  db: 'ft',
  user: 'ft',
  password: '123456'
})

module.exports = m
