const mongoose = require("mongoose");

var tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    endCity: {
      type: String,
      required: true,
    },
    image: {
      image1: { type: String, required: false },
      image2: { type: String, required: false },
      image3: { type: String, required: false },
      image4: { type: String, required: false },
    },
    price: {
      price: { type: String, required: true },
      priceBaby: { type: String, required: false },
      priceChildren: { type: String, required: false },
    },
    time: {
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
    },
    fightTime: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    fightBackTime: {
      startBackTime: { type: String, required: true },
      endBackTime: { type: String, required: true },
    },
    slot: {
      type: String,
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    hotel: {
      type: String,
      required: true,
    },
    typeCombo: {
      type: String,
      required: true,
    },
    // updateBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tour", tourSchema);
