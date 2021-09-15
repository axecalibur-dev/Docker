const protect = (req, res, next) => {
  const { user } = req.session;
  if (!user) {
    res.status.json({
      status: "Fail",
      message: "Unauthorized",
    });
  }

  req.user = user;

  next();
};

module.exports = protect;
