const express = require("express");
const router = express.Router();
const depositController = require("../controllers/depositController");
const auth = require("../middleware/auth");

// Webhook endpoint (no auth required)
router.post("/webhook", depositController.processWebhook);

// Authenticated endpoints
router.get("/:id", auth, depositController.getDeposit);
router.get("/account/:accountId", auth, depositController.getDeposits);

module.exports = router;
