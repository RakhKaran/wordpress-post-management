const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if(res.status(400)){
      console.log(res.status(400).json({ errors: errors.array() }));
    }
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateRequest };