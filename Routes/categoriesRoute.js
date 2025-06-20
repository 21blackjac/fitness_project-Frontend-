const express = require("express");
const router = express.Router();
const Categorie = require("../Models/Categorie");

//Affichier les Categories
router.get("/Categories", async (req, res) => {
  try {
    const showCategories = await Categorie.find({});

    if (showCategories.length === 0) {
      res.status(404).send("Categories not found");
    } else {
      res.status(200).json(showCategories);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

//Affichier une Categorie par id
router.get("/Categories/:_id", async (req, res) => {
  try {
    const categorieId = req.params._id;
    const showCategorie = await Categorie.findOne({ _id: categorieId });

    if (!showCategorie) {
      res.status(404).send("Categorie not found");
    } else {
      res.json(showCategorie);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err.message);
  }
});

// Affichier le nombre des categories
router.get("/categoriesCount", async (req, res) => {
  try {
    const count = await Categorie.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Ajouter une Categorie
router.post("/addCategorie", async (req, res) => {
  try {
    const newCategorie = new Categorie(req.body);
    await newCategorie.save();
    res.json({
      message: "Categorie added successfully!",
      id: newCategorie.id,
    });
  } catch (err) {
    console.log("Categorie not added: ", err.message);
    res.json({
      message: "Something is wrong!!!",
    });
  }
});

//Modifier une Categorie
router.put("/updateCategorie/:_id", async (req, res) => {
  try {
    const categorieId = req.params._id;
    const updateCategorie = await Categorie.updateOne(
      { _id: categorieId },
      { $set: req.body }
    );

    if (updateCategorie.modifiedCount === 0) {
      res.send("No Categorie modified");
    } else {
      res.status(200).send("Categorie updated successfully!");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

//Suprimer une Categorie
router.delete("/deleteCategorie/:_id", async (req, res) => {
  try {
    const categorieId = req.params._id;
    const deleteCategorie = await Categorie.deleteOne({ _id: categorieId });

    if (deleteCategorie.deletedCount === 0) {
      res.status(404).send("No categorie deleted");
    } else {
      res.status(200).send("Categorie deleted successfully");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

module.exports = router;
