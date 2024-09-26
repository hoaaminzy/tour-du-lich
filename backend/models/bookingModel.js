const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["nam", "nu"], // Assuming 'nam' for male and 'nu' for female
    required: true,
  },
  birthDate: {
    type: String, // Format: dd/mm/yyyy
    required: true,
  },
});
const passengersSchema = new mongoose.Schema({
  adults: [passengerSchema],
  children: [passengerSchema],
  baby: [passengerSchema],
});

// Define the schema
const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    passengers: {
      type: passengersSchema,
      required: true,
    },
    selectedPayment: {
      type: String,
      enum: ["cash", "bank", "momo"],
      required: true,
    },
    totalPrice: {
      type: String,
      required: true,
    },
    messageContent: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Create the model
const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
