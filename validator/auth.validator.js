const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username 3-30 ta belgi bo'lishi kerak")
    .isAlphanumeric()
    .withMessage("Username faqat harf va raqamlardan iborat bo'lishi kerak"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("To'g'ri email manzil kiriting")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
];

const verifyValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("To'g'ri email manzil kiriting"),

  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP kodi 6 raqamdan iborat bo'lishi kerak")
    .isNumeric()
    .withMessage("OTP faqat raqamlardan iborat bo'lishi kerak"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("To'g'ri email manzil kiriting"),

  body("password")
    .notEmpty()
    .withMessage("Parol kiritish shart"),
];

// Validatsiya natijalarini tekshirish
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validatsiya xatosi",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  registerValidator,
  verifyValidator,
  loginValidator,
  validate,
};
