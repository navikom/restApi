/**
 * All API methods and database connection info
 */
const mongoose = require('mongoose'),
  config = require('../config'),
  db = mongoose.connection;

db.on('error', function() {
  console.log('Database connection error'.red);
});
db.on('connecting', function() {
  console.log('Database connecting'.cyan);
});
db.once('open', function() {
  console.log('Database connection established'.green);
});
db.on('reconnected', function() {
  console.log('Database reconnected'.green);
});

mongoose.connect(config.db_url, {server: {auto_reconnect: true}, useNewUrlParser: true});

module.exports = {
  Carrier: require('./controllers/carrier'),
  Manufacture: require('./controllers/manufacturer'),
  Phone: require('./controllers/phone')
};
