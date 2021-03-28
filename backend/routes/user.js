const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/profil/:userId", auth, userCtrl.viewProfil);
router.put("/profil/:userId", auth, userCtrl.editProfil);
router.delete("/profil/:userId", auth, userCtrl.deleteProfil);

module.exports = router;
