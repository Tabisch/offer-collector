import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers";

mongoose.connect(connectionString);

const lastFetchSchema = new Schema({
  seller: String,
  fetchTime: Date,
});

const LastFetch = model('LastFetch', lastFetchSchema);

export default LastFetch;