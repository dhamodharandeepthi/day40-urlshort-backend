const shortid = require("shortid");
const Url = require("../models/urlModel");

const generateShortUrl = async (req, res) => {
  try {
    //    Destructuring longurl from body
    let { longURL } = req.body;
    // console.log("longurl is ", longURL);
    console.log("bck ", longURL);

    // console.log(req.baseUrl);
    let url = await Url.findOne({ longURL });
    console.log(url);
    if (url) {
      return res.status(200).json({
        ...url._doc,
        // shortID: url.shortID,
        shortURL: `${req.baseUrl}/${url.shortID}`,
      });
    } else {
      const url = await Url.create({
        longURL,
        shortID: shortid.generate(),
        // shortURL: `${req.baseUrl}/${url.shortID}`,
      });

      console.log(url);
      return res.status(200).json({
        success: true,
        ...url._doc,
        // longURL,
        // shortID,
        shortURL: `${req.baseUrl}/${url.shortID}`,
        msg: "successssfullllllllll",
      });
    }
    // console.log(shortID);
    // console.log(shortURL);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "server error",
      success: false,
    });
  }
};

// CLICKS ON SHORT URLS
const getShortURL = async (req, res) => {
  try {
    const { shortID } = req.params;
    console.log(shortID);
    let url = await Url.findOne({ shortID });
    if (!url) {
      return res.status(404).json({
        msg: "not a  valid url",
      });
    }
    url.clicks++;
    await url.save();
    console.log(url);
    res.redirect(url.longURL);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

module.exports = {
  generateShortUrl,
  getShortURL,
};
