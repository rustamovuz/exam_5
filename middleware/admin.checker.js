const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken");

module.exports = function adminChecker(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw CustomErrorHandler.BadRequest("Token topilmadi");
    }

    const bearer = token.split(" ")[0];
    const partOfToken = token.split(" ")[1];

    if (bearer !== "Bearer" || !partOfToken) {
      throw CustomErrorHandler.BadRequest("Bearer token noto'g'ri formatda");
    }

    const decode = jwt.verify(partOfToken, process.env.SECRET_KEY);

    req.user = decode;

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      throw CustomErrorHandler.Forbidden("Sizda admin yoki superadmin huquqi yo'q");
    }

    next();
  } catch (error) {
    next(error);
  }
};
