const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Users = require("./Routes/usersRoute");
const Categories = require("./Routes/categoriesRoute");
const Admin = require("./Routes/adminRoute");
const Payment = require("./Routes/paymentRoute");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.dbUri;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use("/Users", Users);
app.use("/Categorie", Categories);
app.use("/Admin", Admin);
app.use("/Payment", Payment);

//Connection
async function connection() {
  try {
    await mongoose.connect(`${uri}`);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log("Error, not connected to MongoDB");
  }
}
connection();

app.listen(port, () => {
  console.log(`The serveur is connected to the port: ${port}`);
});
