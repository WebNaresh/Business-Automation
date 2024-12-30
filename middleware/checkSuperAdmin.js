const checkSuperAdmin = async (req, res, next) => {
  try {
    if (!req?.user?.user?.profile?.includes?.("Super-Admin")) {
      return res
        .status(400)
        .json({ success: false, message: "You Don't have permission" });
    }
    next();
  } catch (error) {
    console.error("Error in checkSuperAdmin");
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { checkSuperAdmin };
