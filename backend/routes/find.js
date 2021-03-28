const express = require("express");
const router = express.Router();

const findCtrl = require("../controllers/find");

router.get("/find/:name", findCtrl.findUser);
router.get("/find/:message", findCtrl.findMessage);
