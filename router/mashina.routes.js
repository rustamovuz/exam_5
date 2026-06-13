const { Router } = require("express");
const {
  getAllMashinalar,
  getMashinalarByKategoriya,
  getOneMashina,
  searchMashinalar,
  addMashina,
  updateMashina,
  deleteMashina,
} = require("../controller/mashina.controller");
const adminChecker = require("../middleware/admin.checker");
const authorization = require("../middleware/authorization");
const multer = require("../config/multer");
const { mashinaValidator, validate } = require("../validator/mashina.validator");

const mashinaRouter = Router();


mashinaRouter.get("/mashinalar", getAllMashinalar);
mashinaRouter.get("/mashinalar/search", searchMashinalar);
mashinaRouter.get("/mashinalar/kategoriya/:kategoriyaId", getMashinalarByKategoriya);

mashinaRouter.get("/mashinalar/:id", getOneMashina);
mashinaRouter.post(
  "/mashinalar",
  adminChecker,
  multer.fields([
    { name: "rasm_360_tashqi", maxCount: 1 },
    { name: "rasm_360_ichki", maxCount: 1 },
    { name: "model_rasmi", maxCount: 1 },
  ]),
  mashinaValidator,
  validate,
  addMashina
);

mashinaRouter.put(
  "/mashinalar/:id",
  adminChecker,
  multer.fields([
    { name: "rasm_360_tashqi", maxCount: 1 },
    { name: "rasm_360_ichki", maxCount: 1 },
    { name: "model_rasmi", maxCount: 1 },
  ]),
  updateMashina
);

mashinaRouter.delete("/mashinalar/:id", adminChecker, deleteMashina);

module.exports = mashinaRouter;
