/**
 * The schema and model for carrier data
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const carrierSchema = new Schema({
  name: {type: String, required: true}
});

exports.model = mongoose.model('carriers', carrierSchema);