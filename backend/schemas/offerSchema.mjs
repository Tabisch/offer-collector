import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers-collector";

mongoose.connect(connectionString);

const offerSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  seller: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  } ,
});

const Offer = model('Offer', offerSchema);

export default Offer;