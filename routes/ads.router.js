const express = require('express');
const router = express.Router();

const AdsService = require('./../services/ads.service');
const service = new AdsService();

router.get('/images/:name', function(req, res) {
  const { name } = req.params;

  var base64Img = require('base64-img');
  var imageData1 = base64Img.base64Sync("./images/"+name+".png");
  var base64Data = imageData1.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  var img = Buffer.from(base64Data, 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  res.end(img);

});

router.post("/", async (req, res) => {
  if (req.body.price && req.body.description) {
    const response = await service.create(req.body);
    if (response===false) {
      res.status(200).json({ "message": "not create" });
    } else {
      res.status(201).json({
        "image":response
      });
    }
  } else {
    res.status(400).send('Authorization required!');
  }
});

module.exports = router;
