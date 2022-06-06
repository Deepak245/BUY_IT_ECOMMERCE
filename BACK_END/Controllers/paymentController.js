const catchAsyncError = require("../MiddleWares/catchAsyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Hhere we keep secret key. in front end we should keep API KEY
// console.log(process.env.STRIPE_SECRET_KEY);
// procee stripe payments=> /api/v1/payment/process.

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",

    metadata: { integration_check: "accept_a_payment" },
  });
  // console.log(paymentIntent);
  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
  // from the payment intent we have to extract the client secret key and should pass it to frontend from the request.
  // on the backend we should use secret key on frontend we must use apikey. for security sake send it from backend.
});

// send stripe api key =?/api/v1/stripeapi
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    // stripeApiKey: process.env.STRIPE_SECRET_KEY, // this should be a publish key from test mode dont keep api secretkey  STRIPE_API_KEY
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
  // from the payment intent we have to extract the client secret key and should pass it to frontend from the request.
  // on the backend we should use secret key on frontend we must use apikey. for security sake send it from backend.
});
