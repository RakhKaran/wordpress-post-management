const { body } = require("express-validator");

const createPostDTO = [
  body("postTitle").notEmpty().withMessage("Post title is required"),
  body("postSlug").notEmpty().withMessage("Post slug is required"),
  body("postContent").notEmpty().withMessage("Post content is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
  body("postFields")
  .isArray({ min: 1 }).withMessage("At least one field is required in postFields")
  .custom((value) => {
    if (!value.every(item => Object.keys(item).length > 0)) {
      throw new Error("Each field must be a non-empty object");
    }
    return true;
  }),  
  body("status").isIn(["draft", "publish"]).withMessage("Invalid status"),
];

module.exports = createPostDTO;