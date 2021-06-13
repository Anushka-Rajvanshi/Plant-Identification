const express = require("express");
const ejs = require("ejs");
var fs = require("fs");
const https = require("https");
const axios = require("axios");
const {
  SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS
} = require("constants");

const app = express();

app.use(express.static( __dirname + "/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

app.get("/", function (req, res) {
  res.render("home");
});

app.post("/", function (req, res) {
  let files = [];
  let names = [];
  let probability = [];
  let moreImages = [];
  let description = [];
  let wikiurl = [];
  let sciName = [];
  files.push(req.body.imageString);

  const data = {
    api_key: "aFi6NTaRgc8qF2tBd1tfCqFx1M2SS6DEByRObiSSIE5smithUr",
    images: files,
    modifiers: ["crops_fast", "similar_images"],
    plant_language: "en",
    plant_details: [
      "common_names",
      "url",
      "name_authority",
      "wiki_description",
      "taxonomy",
      "synonyms",
    ],
  };

  axios
    .post("https://api.plant.id/v2/identify", data)
    .then((response) => {
      console.log("Success");
      response.data.suggestions.forEach(function (item) {
        names.push(item.plant_name);
        probability.push(item.probability);
        description.push(item.plant_details.wiki_description.value);
        wikiurl.push(item.plant_details.url);
        sciName.push(item.plant_details.scientific_name);
        let arr = [];
        item.similar_images.forEach(function (imageItem) {
          arr.push(imageItem.url);
        });
        moreImages.push(arr);
      });
      res.render('result', {names:names, sciName:sciName, description:description, wikiurl:wikiurl, moreImages:moreImages});
  }).catch((error) => {
      console.error("Error: ", error);
    });
  });

  // app.get("/result", function(req,res){
    
  //   res.render('result', {names:names, sciName:sciName, description:description, wikiurl:wikiurl, moreImages:moreImages});
  // });

  let port = process.env.PORT;
  if (port == null || port == "") {
      port = 3000;
  }
  app.listen(port, function (req, res) {
      console.log("server started successfuly", port);
  });