const CustomErrorHandler = require("../error/error");

module.exports = function (err, req, res, next) {
  // 1. CustomErrorHandler xatosi
  if (err instanceof CustomErrorHandler) {
    return res.status(err.status).json({
      success: false,
      message: err.message || "Xatolik yuz berdi",
    });
  }

  // 2. Mongoose validation xatosi
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      success: false,
      message: "Validatsiya xatosi",
      errors,
    });
  }

  // 3. Mongoose CastError (noto'g'ri ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Noto'g'ri ID format",
    });
  }

  // 4. Mongoose duplicate key xatosi
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Bu ${field} allaqachon mavjud`,
    });
  }

  // 5. JWT xatosi
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token noto'g'ri",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token muddati o'tgan",
    });
  }

  // 6. Multer xatosi
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "Fayl hajmi 5MB dan oshmasligi kerak",
    });
  }

  // 7. Qolgan barcha kutilmagan xatolar
  console.error("SERVER XATOSI:", err);
  return res.status(500).json({
    success: false,
    message: "Ichki server xatosi",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
