/**
 * The schema and model for carrier data
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarrierSchema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'Users'}
});

exports.model = mongoose.model('Carriers', CarrierSchema);