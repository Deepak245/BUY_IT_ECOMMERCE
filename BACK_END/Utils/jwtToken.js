//create and send token and save in the http only cookie
const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res) => {
  // console.log(user._id.toString())
  // create jwt token
  const token = user.getJwtToken();
  console.log(token);
  // console.log(user)
  // const payload = {
  //     id:user._id.toString()

  // }
  // const token = jwt.sign(payload,process.env.JWT_SECRET)
  // console.log(token)
  // after getting token from the user keep it in cookie
  // so prepare options for cookie
  // console.log(process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000)
  const options = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
  };
  // make sure this is true if this is not true any other JS code can access the cookie.
  // in .cookie method first 'token' is a key , second token is value we get from user and option is object which we are setting how the cookie
  //should be stored.
  // console.log(options.expires);
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: user,
    token: token,
  });
  // now go to config file set COOKIE_EXPIRES_TIME to 7 days or what ever it is.
};

module.exports = sendToken;
