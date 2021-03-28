const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const msgCtrl = require("../controllers/message");

router.get("/message", auth, msgCtrl.allMessages);
router.post("/message", auth, msgCtrl.createMessage);
router.get("/message/:msgId", auth, msgCtrl.viewMessage);
router.put("/message/:msgId", auth, msgCtrl.editMessage);
router.delete("/message/:msgId", auth, msgCtrl.deleteMessage);

router.post("/message/:msgId/like", auth, msgCtrl.postLike);
router.delete("/message/:msgId/like", auth, msgCtrl.deleteLike);
router.get("/message/:msgId/like", auth, msgCtrl.allLikes);

module.exports = router;
