import mongoose from "mongoose";

const businessSchema = mongoose.Schema({
  businessName: { type: String, required: true, unique: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  businessPhoto: {
    type: String,
    required: true,
    default: "http://inventory.us-east-1.elasticbeanstalk.com/images/business/business_photo_default.png",
  },
  locations: [
    {
      location: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Location",
      },
    },
  ],
});

businessSchema.methods.addLocationToBusiness = async function (newLocationId) {
  this.locations.push({ location: newLocationId });
  return this.save();
};

export const Business = mongoose.model("Business", businessSchema);
