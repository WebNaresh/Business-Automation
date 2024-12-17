const sendToken = (user, res, statusCode) => {
  console.log(`🚀 ~ user:`, user);
  const token = user.getJWTToken();
  console.log(`🚀 ~ token:`, token);

  const options = {
    expires: new Date(Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};
module.exports = sendToken;
