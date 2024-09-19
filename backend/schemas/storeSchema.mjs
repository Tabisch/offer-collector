import mongoose from "mongoose";
const { Schema, model } = mongoose;

const connectionString = "mongodb://db/offers-collector";

mongoose.connect(connectionString);

const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { 
      type: [Number],
      default: [0, 0] 
    }
  },
  targetApiIdentifier: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  },
  website: {
    type: String,
    required: false
  },
});

storeSchema.index({ "location": "2dsphere" });

const Store = model('Store', storeSchema);

export default Store;