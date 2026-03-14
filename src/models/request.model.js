import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({

  patientName: {
    type: String,
    required: true
  },

  bloodGroup: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  unitsRequired: {
    type: Number,
    required: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

export const Request = mongoose.model("Request", requestSchema);