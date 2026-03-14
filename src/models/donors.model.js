import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({

  name: {
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

  contact: {
    type: String,
    required: true
  },

  lastDonationDate: {
    type: Date
  },

}, { timestamps: true });

export const Donor = mongoose.model("Donor", donorSchema);