const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const auth = require("../middleware/auth");

router.post("/checkin", auth, visitorController.checkInVisitor);
router.put("/checkout/:id", auth, visitorController.checkOutVisitor);
router.get("/history", auth, visitorController.getVisitorHistory);

module.exports = router;
