const mongoose = require("mongoose");
const { type } = require("os");
const { Schema } = mongoose;
const PlaceSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  // perks: [String],
  // extraInfo: String,
  // chechIn: Number,
  // chechOut: Number,
  // maxGuests: Number,
});

const placeModel = mongoose.model("Place", PlaceSchema);

module.exports = placeModel;
