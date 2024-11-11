const mongoose = require("mongoose");
const { Schema } = mongoose;

const farmSchema = new Schema({
  title: String,
  location: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
