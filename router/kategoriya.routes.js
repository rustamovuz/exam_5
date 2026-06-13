const { Router } = require("express");
const {
  getAllKategoriyalar,
  getOneKategoriya,
  addKategoriya,
  updateKategoriya,
  deleteKategoriya,
} = require("../controller/kategoriya.controller");
const adminChecker = require("../middleware/admin.checker");
const authorization = require("../middleware/authorization");
const multer = require("../config/multer");
const { kategoriyaValidator, validate } = require("../validator/mashina.validator");

const kategoriyaRouter = Router();

kategoriyaRouter.get("/kategoriyalar", getAllKategoriyalar);
kategoriyaRouter.get("/kategoriyalar/:id", getOneKategoriya);
kategoriyaRouter.post(
  "/kategoriyalar",
  adminChecker,
  multer.single("rasm"),
  kategoriyaValidator,
  validate,
  addKategoriya
);
kategoriyaRouter.put(
  "/kategoriyalar/:id",
  adminChecker,
  multer.single("rasm"),
  updateKategoriya
);
kategoriyaRouter.delete("/kategoriyalar/:id", adminChecker, deleteKategoriya);

module.exports = kategoriyaRouter;
