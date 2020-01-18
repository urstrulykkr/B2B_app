var express = require("express");
var router = express.Router();
var invoice = require("../services/invoice");
var user = require("../utils/invoiceFormats");
/* GET home page. */
router.get("/", async function(req, res, next) {
  console.log("data", invoice.test);
  res.render("index", { title: "Express", data: invoice.test });
});

router.get("/test", invoice.test);

module.exports = router;
