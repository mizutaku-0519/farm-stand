const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/product");
const Farm = require("./models/farm");
const methodOverride = require("method-override");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmstand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB接続中...");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["肉", "野菜", "乳製品", "果物", "その他"];

app.get("/farm/new", (req, res) => {
  res.render("farm/new");
});

app.get("/farm/:id/products/new", async (req, res) => {
  const farmId = req.params.id;
  const farm = await Farm.findById(farmId);
  res.render("products/new", { farm, categories });
});

app.get("/farm/:id/edit", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("farm/edit", { farm });
});

app.get("/farm/:id", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id).populate("products");
  res.render("farm/show", { farm });
});

app.get("/farm", async (req, res) => {
  const farms = await Farm.find();
  res.render("farm/index", { farms });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("farm");
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category: category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "全" });
  }
});

app.post("/farm/:id/products", async (req, res) => {
  const product = new Product(req.body);
  const { id } = req.params;
  const farm = await Farm.findById(id);
  product.farm = farm;
  farm.products.push(product);
  await product.save();
  await farm.save();
  res.redirect(`/farm/${id}`);
});

app.post("/farm", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  res.redirect("/farm");
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, req.body);
  res.redirect(`/products/${id}`);
});

app.put("/farm/:id", async (req, res) => {
  const { id } = req.params;
  await Farm.findByIdAndUpdate(id, req.body);
  res.redirect(`/farm/${id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
});

app.listen(3000, () => {
  console.log("ポート番号3000で受付中...");
});
