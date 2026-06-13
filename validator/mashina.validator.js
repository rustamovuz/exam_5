const { body, validationResult } = require("express-validator");

// Mashina qo'shish validatsiyasi
const mashinaValidator = [
  body("kategoriya")
    .notEmpty()
    .withMessage("Kategoriya (markasi) kiritish shart")
    .isMongoId()
    .withMessage("Kategoriya ID noto'g'ri"),

  body("nomi")
    .trim()
    .notEmpty()
    .withMessage("Mashina nomini kiritish shart")
    .isLength({ max: 100 })
    .withMessage("Nomi 100 belgidan oshmasligi kerak"),

  body("tanirovkasi")
    .optional()
    .isIn(["Yoq", "Bor"])
    .withMessage("Tanirovkasi faqat 'Yoq' yoki 'Bor' bo'lishi mumkin"),

  body("motor")
    .notEmpty()
    .withMessage("Motor hajmini kiritish shart")
    .isFloat({ min: 0.5, max: 10 })
    .withMessage("Motor hajmi 0.5 dan 10 gacha bo'lishi kerak"),

  body("yil")
    .notEmpty()
    .withMessage("Yilini kiritish shart")
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage(`Yil 1990 dan ${new Date().getFullYear() + 1} gacha bo'lishi kerak`),

  body("rang")
    .trim()
    .notEmpty()
    .withMessage("Rangini kiritish shart"),

  body("masofa")
    .notEmpty()
    .withMessage("Bosib o'tilgan masofani kiritish shart")
    .isInt({ min: 0 })
    .withMessage("Masofa musbat son bo'lishi kerak"),

  body("uzatmalar_qutisi")
    .notEmpty()
    .withMessage("Uzatmalar qutisi turini kiritish shart")
    .isIn(["Avtomat karobka", "Mexanik karobka", "Variator", "Robotlashgan"])
    .withMessage("Uzatmalar qutisi turi noto'g'ri"),

  body("narxi")
    .notEmpty()
    .withMessage("Narxini kiritish shart")
    .isInt({ min: 0 })
    .withMessage("Narx musbat son bo'lishi kerak"),

  body("tavsif")
    .trim()
    .notEmpty()
    .withMessage("Tavsifini kiritish shart")
    .isLength({ min: 10 })
    .withMessage("Tavsif kamida 10 ta belgidan iborat bo'lishi kerak"),
];

// Kategoriya validatsiyasi
const kategoriyaValidator = [
  body("nomi")
    .trim()
    .notEmpty()
    .withMessage("Kategoriya nomini kiritish shart")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nomi 2-50 ta belgi bo'lishi kerak"),
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
  mashinaValidator,
  kategoriyaValidator,
  validate,
};
