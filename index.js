const express = require("express");
const cors = require("cors");

const app = express();
const urlModel = require("./models/URL");
const shortId = require("shortid");

var validUrl = require("valid-url");

require("dotenv").config();

const mongodb_user = process.env.DB_USER;
const mongodb_password = process.env.DB_PASSWORD;
const PORT = process.env.PORT;

console.log("mongodb_user: " + mongodb_user);
console.log("mongodb_password: " + mongodb_password);

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.h8brfdx.mongodb.net/`
);
console.log("DB connected");

app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  var url = req.body.originalUrl;
  var urlId = "";
  valid = validUrl.isUri(url);
  console.log(valid);

  if (valid != undefined) {
    try {
      urlId = shortId.generate();
      res.send(urlId);
    } catch (err) {
      console.log("err" + err);
    }
  } else {
    res.send("false");
    return;
  }
});

app.post(`/insert`, async (req, res) => {
  await urlModel.create({
    originalUrl: req.body.originalUrl,
    shortUrl: req.body.shortUrl,
  });

  try {
    await urlModel.save();
    console.log("saved to db");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/read", async (req, res) => {
  urlModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/:route", async (req, res) => {
  try {
    const url = await urlModel.findOne({ shortUrl: req.params.route });
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json("No url found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await urlModel.findByIdAndRemove(id).exec();
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
