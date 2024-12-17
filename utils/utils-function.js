const checkRequiredVariables = (req, requiredVariables) => {
  const missingVariables = requiredVariables.filter(
    (variable) => !(variable in req.body)
  );

  if (missingVariables.length > 0) {
    return {
      success: false,
      message: `Missing required variables: ${missingVariables.join(", ")}`,
    };
  }

  return {
    success: true,
  };
};
module.exports = { checkRequiredVariables };
