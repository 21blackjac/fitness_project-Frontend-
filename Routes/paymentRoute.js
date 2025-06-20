const express = require("express");
const router = express.Router();
const Payment = require("../Models/Payment");

//Affichier les Payments
router.get("/Payments", async (req, res) => {
  try {
    const showPayments = await Payment.find({});

    if (showPayments.length === 0) {
      res.status(404).send("Payments not found");
    } else {
      res.status(200).json(showPayments);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

//Affichier une Payment par id
router.get("/Payments/:_id", async (req, res) => {
  try {
    const PaymentId = req.params._id;
    const showPayment = await Payment.findOne({ _id: PaymentId });

    if (!showPayment) {
      res.status(404).send("Payment not found");
    } else {
      res.json(showPayment);
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err.message);
  }
});

//Affichier le nombre des Payment
router.get("/paymentsCount", async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Ajouter une Payment
router.post("/addPayment", async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    await newPayment.save();
    res.json({
      message: "Payment added successfully!",
      id: newPayment.id,
    });
  } catch (err) {
    console.log("Payment not added: ", err.message);
    res.json({
      message: "Something is wrong!!!",
    });
  }
});

//Modifier une Payment
router.put("/updatePayment/:_id", async (req, res) => {
  try {
    const PaymentId = req.params._id;
    const updatePayment = await Payment.updateOne(
      { _id: PaymentId },
      { $set: req.body }
    );

    if (updatePayment.modifiedCount === 0) {
      res.send("No Payment modified");
    } else {
      res.status(200).send("Payment updated successfully!");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

//Suprimer une Payment
router.delete("/deletePayment/:_id", async (req, res) => {
  try {
    const PaymentId = req.params._id;
    const deletePayment = await Payment.deleteOne({ _id: PaymentId });

    if (deletePayment.deletedCount === 0) {
      res.status(404).send("No Payment deleted");
    } else {
      res.status(200).send("Payment deleted successfully");
    }
  } catch (err) {
    console.log("Something is wrong!!! ", err);
  }
});

module.exports = router;
