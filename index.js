const express = require('express')
const Sequelize = require('sequelize')
const bunyan = require('bunyan')
var bodyParser = require('body-parser')
const routes = require('./routes')

require('./middleware/auth');

var log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: './logs/errors.log' 
    }
  ]
});

const db = new Sequelize(
  (process.env.DB || 'database'),
  (process.env.DBUSER || 'admin'),
  (process.env.DBPASS || '012345'), {
  host: process.env.DBHOST || 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

db.authenticate().then(() => {
  console.log('Database connected...')
}).catch(err => {
  console.log('Error: ' + err)
})

const app = express()

app.set('x-powered-by', false)

app.use(bodyParser.json())

app.locals.database = db
app.locals.logger = log

app.get('/', (req, res) => res.send('App is working'))

app.use('/api', routes)

const PORT = process.env.PORT || 5000;
db.sync().then(() => {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
}).catch(err => console.log("Error: " + err));

module.exports = app; //Necessario per i test