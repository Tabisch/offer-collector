import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers-collector";

mongoose.connect(connectionString);

const storeSchema = new Schema({
  targetApiIdentifier: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  }
});

const Store = model('Store', storeSchema);

export default Store;