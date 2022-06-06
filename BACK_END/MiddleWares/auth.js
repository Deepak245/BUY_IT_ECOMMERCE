// checks if user is authenticated or not
const catchAsyncErrors = require("./catchAsyncError");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/ErrorHandler");
const User = require("../Models/user");
const dotenv = require("dotenv");
dotenv.config({ path: "BACK_END/config/config.env" });

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // i have to pull token from cookie https only cookies can be accessed on server rather than front end
  // so its more secured way.
  const { token } = req.cookies;
  // console.log(token);
  // console.log(process.env.JWT_SECRET)
  console.log(token);
  if (!token || typeof token === "undefined") {
    next(new ErrorHandler("Login First to access the resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // here token is verified
  // console.log(decoded)
  // userDecoded = await User.findById(decoded.id);
  // console.log("User from Decoded request"+userDecoded);
  req.user = await User.findById(decoded.id);
  // console.log(decodeduser);
  // req.user = decodeduser._id.toString();
  // req.userrole = decodeduser.role;
  // console.log(req.user.role);

  next(); // here we are pushing to next middle ware.
});

// we should import cookie parser before testing the product rout being authorized.

// Handling user Roles.
exports.authorizeRoles = (...roles) => {
  // console.log(...roles)
  return (req, res, next) => {
    // console.log(req.userrole)
    if (!roles.includes(req.user.role)) {
      // as long as we keep user in request in above func so long we can access user roles like this step
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access the request`,
          403
        )
      );
    }
    next();
  };
};
