const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeApi,
} = require("../Controllers/paymentController");

const { isAuthenticatedUser, authorizeRoles } = require("../MiddleWares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);

module.exports = router;