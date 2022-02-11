const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());

app.get("/word", (req, res) => {
  var options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: { count: "5", wordLength: "5" },
    headers: {
      "x-rapidapi-host": "random-words5.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_KEY,
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data[0]);
    })
    .catch((error) => console.error(error));
});

app.get("/check", (req, res) => {
  var options = {
    method: "GET",
    url: "https://twinword-word-graph-dictionary.p.rapidapi.com/association/",
    params: { entry: req.query.word },
    headers: {
      "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_KEY,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      if (response.data.result_code != 200) {
        res.json(false);
      }
      res.json(true);
    })
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port:" + process.env.PORT)
);
