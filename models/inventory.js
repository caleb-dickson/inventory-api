import mongoose from "mongoose";

const inventorySchema = mongoose.Schema({
  parentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Location",
  },
  dateStart: { type: String, required: true },
  dateEnd: { type: String, required: true },
  department: { type: String, required: true }, // BOH OR FOH or ...
  isFinal: { type: Boolean, required: true },
  inventory: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: Number, required: false, default: 0 },
    },
  ],
});

// inventorySchema.methods.updateInventory = async function (inventoryUpdateData) {
//   console.log("updateInventory |||");
//   this.parentLocation = inventoryUpdateData.parentLocation;
//   this.dateStart = inventoryUpdateData.dateStart;
//   this.dateEnd = inventoryUpdateData.dateEnd;
//   this.department = inventoryUpdateData.department;
//   this.isFinal = inventoryUpdateData.isFinal;
//   this.inventory = inventoryUpdateData.dInventory;

//   return this.save();
// };

export const Inventory = mongoose.model("Inventory", inventorySchema);
