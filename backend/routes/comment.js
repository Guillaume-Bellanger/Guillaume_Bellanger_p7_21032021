const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//auth a mettre en place

const commentCtrl = require("../controllers/comment");

router.get("/message/:msgId/comment", auth, commentCtrl.allComments);
router.post("/message/:msgId/comment", auth, commentCtrl.postComment);
router.put(
  "/message/:msgId/comment/:commentId",
  auth,
  commentCtrl.updateComment
);
router.delete(
  "/message/:msgId/comment/:commentId",
  auth,
  commentCtrl.deleteComment
);

module.exports = router;
