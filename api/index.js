/**
 * All API methods and database connection info
 */
const mongoose = require('mongoose'),
  CONFIG = require('../config/config'),
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

const mongoLocation = `mongodb://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
mongoose
  .connect(mongoLocation, {server: {auto_reconnect: true}, useNewUrlParser: true});

module.exports = {
  Carrier: require('./controllers/carrier'),
  Manufacture: require('./controllers/manufacturer'),
  Phone: require('./controllers/phone')
};
