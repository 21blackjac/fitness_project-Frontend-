const express = require("express");
const router = express.Router();
const user = require("../Models/Users");

//Affichier tout les utilisateurs
router.get("/users", async (req, res) => {
  try {
    const showUsers = await user.find({});
    if (showUsers.length === 0) {
      res.status(404).send("No users found!");
    } else {
      res.status(200).json(showUsers);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

//Affichier l'utilisateur par _id
router.get("/user/:_id", async (req, res) => {
  try {
    const user_id = req.params._id;
    const showUser = await user.findOne({ _id: user_id });
    if (!showUser) {
      res.status(404).send("User not found!");
    } else {
      res.json(showUser);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

// Affichier le nombre des utilisateurs
router.get("/usersCount", async (req, res) => {
  try {
    const count = await user.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Ajouter les utilisateurs
router.post("/addUser", async (req, res) => {
  try {
    console.log("Request Body : ", req.body);
    const newUser = new user(req.body);
    await newUser.save();
    res.json({
      message: "User Added successfully!",
      id: newUser.id,
    });
  } catch (err) {
    console.log("Message erreur: ", err.message);
    // console.log('User Not Added: ', err);
  }
});

//Modifier l'utilisateur
router.put("/updateUser/:_id", async (req, res) => {
  try {
    const user_id = req.params._id;
    const updateUser = await user.updateOne(
      { _id: user_id },
      { $set: req.body }
    );
    if (updateUser.modifiedCount === 0) {
      res.status(404).send("No user updated");
    } else {
      res.json({
        message: "User updated successfully!",
        id: updateUser.upsertedId,
      });
    }
  } catch (err) {
    console.log("Something is wrong!!!", err);
  }
});

//Suprimer l'utilisateur
router.delete("/deleteUser/:_id", async (req, res) => {
  try {
    const user_id = req.params._id;
    const deleteUser = await user.deleteOne({ _id: user_id });

    if (deleteUser.deletedCount === 0) {
      res.status(404).send("No user deleted");
    } else {
      res.status(200).send("User deleted successfully!");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

module.exports = router;
