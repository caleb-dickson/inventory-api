import mongoose from "mongoose";

import { Inventory } from "./inventory.js";
import { Product } from "./product.js";

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

// businessSchema.methods.deleteBusiness = async function () {

//   for (const location of this.locations) {
//     await Product.deleteMany({ parentOrg: location.location._id });
//     await Inventory.deleteMany({ parentLocation: location.location._id });
//   }

//   return this.delete();
// }

export const Business = mongoose.model("Business", businessSchema);
