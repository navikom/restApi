/**
 * The schema and model for carrier data
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
  manufacturer: { type: Schema.ObjectId, required: true, ref: 'manufacturers' },
  carriers: {
    type: [{ type: Schema.ObjectId, required: true, ref: 'carriers' }], required: true
  },
  name: { type: String, required: true },
  status: { type: String, required: true }
});

exports.model = mongoose.model('phones', PhoneSchema);