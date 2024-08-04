const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers";

mongoose.connect(connectionString);

const offerSchema = new Schema({
  product: String,
  seller: String,
  price: Number,
  startDateTime: Date,
  endDateTime: Date,
});

const Offer = model('Offer', offerSchema);

module.exports = Offer;