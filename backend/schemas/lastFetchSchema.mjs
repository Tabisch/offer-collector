import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers-collector";

mongoose.connect(connectionString);

const lastFetchSchema = new Schema({
  importer: String,
  type: String,
  fetchTime: Date,
});

const LastFetch = model('LastFetch', lastFetchSchema);

export default LastFetch;