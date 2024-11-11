const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: String,
  price: Number,
  category: {
    type: String,
    enum: ["乳製品", "肉", "野菜", "果物"],
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: "Farm",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
