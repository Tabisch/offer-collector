import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers-collector";

mongoose.connect(connectionString);

const offerSchema = new Schema({
  product: String,
  seller: String,
  price: Number,
  startDateTime: Date,
  endDateTime: Date,
});

const Offer = model('Offer', offerSchema);

export default Offer;