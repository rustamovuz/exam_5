const CustomErrorHandler = require("../error/error");
const KategoriyaSchema = require("../schema/kategoriya.schema");

const getAllKategoriyalar = async (req, res, next) => {
  try {
    const kategoriyalar = await KategoriyaSchema.find();

    res.status(200).json({
      success: true,
      data: kategoriyalar,
    });
  } catch (error) {
    next(error);
  }
};

const getOneKategoriya = async (req, res, next) => {
  try {
    const { id } = req.params;

    const kategoriya = await KategoriyaSchema.findById(id);

    if (!kategoriya) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }

    res.status(200).json({
      success: true,
      data: kategoriya,
    });
  } catch (error) {
    next(error);
  }
};

const addKategoriya = async (req, res, next) => {
  try {
    const { nomi } = req.body;

    if (!req.file) {
      throw CustomErrorHandler.BadRequest("Kategoriya rasmi shart!");
    }

    const existing = await KategoriyaSchema.findOne({ nomi: nomi.toUpperCase() });
    if (existing) {
      throw CustomErrorHandler.BadRequest("Bu kategoriya allaqachon mavjud");
    }

    const kategoriya = await KategoriyaSchema.create({
      nomi,
      rasm: `${process.env.BASE_URL || "http://localhost:4001"}/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Kategoriya muvaffaqiyatli qo'shildi",
      data: kategoriya,
    });
  } catch (error) {
    next(error);
  }
};

const updateKategoriya = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nomi } = req.body;

    const kategoriya = await KategoriyaSchema.findById(id);

    if (!kategoriya) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }

    const updateData = { nomi };

    if (req.file) {
      updateData.rasm = `${process.env.BASE_URL || "http://localhost:4001"}/uploads/${req.file.filename}`;
    }

    await KategoriyaSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      success: true,
      message: "Kategoriya yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

const deleteKategoriya = async (req, res, next) => {
  try {
    const { id } = req.params;

    const kategoriya = await KategoriyaSchema.findById(id);

    if (!kategoriya) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }

    await KategoriyaSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Kategoriya o'chirildi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKategoriyalar,
  getOneKategoriya,
  addKategoriya,
  updateKategoriya,
  deleteKategoriya,
};
