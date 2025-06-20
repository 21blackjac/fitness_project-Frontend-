const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Categorie = mongoose.model("Categorie", categorieSchema);
module.exports = Categorie;
