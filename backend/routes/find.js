const express = require("express");
const router = express.Router();

const findCtrl = require("../controllers/find");

router.get("/find/:search", findCtrl.searchMessage, findCtrl.searchUser);

module.exports = router;
