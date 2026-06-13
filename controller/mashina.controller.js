const CustomErrorHandler = require("../error/error");
const MashinaSchema = require("../schema/mashina.schema");
const KategoriyaSchema = require("../schema/kategoriya.schema");

const getAllMashinalar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit;

    const total = await MashinaSchema.countDocuments();
    const mashinalar = await MashinaSchema.find()
      .populate("kategoriya")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: mashinalar,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMashinalarByKategoriya = async (req, res, next) => {
  try {
    const { kategoriyaId } = req.params;

    const kategoriya = await KategoriyaSchema.findById(kategoriyaId);
    if (!kategoriya) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const total = await MashinaSchema.countDocuments({ kategoriya: kategoriyaId });
    const mashinalar = await MashinaSchema.find({ kategoriya: kategoriyaId })
      .populate("kategoriya")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      kategoriya,
      data: mashinalar,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOneMashina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mashina = await MashinaSchema.findById(id).populate("kategoriya");

    if (!mashina) {
      throw CustomErrorHandler.NotFound("Mashina topilmadi");
    }

    res.status(200).json({
      success: true,
      data: mashina,
    });
  } catch (error) {
    next(error);
  }
};

const searchMashinalar = async (req, res, next) => {
  try {
    const { q, kategoriya, min_narx, max_narx, rang, yil, uzatmalar_qutisi } = req.query;

    const filter = {};

    if (q) {
      filter.nomi = { $regex: q, $options: "i" };
    }

    
    if (kategoriya) {
      filter.kategoriya = kategoriya;
    }

    
    if (min_narx || max_narx) {
      filter.narxi = {};
      if (min_narx) filter.narxi.$gte = Number(min_narx);
      if (max_narx) filter.narxi.$lte = Number(max_narx);
    }

    
    if (rang) {
      filter.rang = { $regex: rang, $options: "i" };
    }

  
    if (yil) {
      filter.yil = Number(yil);
    }

   
    if (uzatmalar_qutisi) {
      filter.uzatmalar_qutisi = uzatmalar_qutisi;
    }

    const mashinalar = await MashinaSchema.find(filter).populate("kategoriya");

    res.status(200).json({
      success: true,
      count: mashinalar.length,
      data: mashinalar,
    });
  } catch (error) {
    next(error);
  }
};

const addMashina = async (req, res, next) => {
  try {
    const {
      kategoriya,
      nomi,
      tanirovkasi,
      motor,
      yil,
      rang,
      masofa,
      uzatmalar_qutisi,
      narxi,
      tavsif,
    } = req.body;

    const kategoriyaMavjud = await KategoriyaSchema.findById(kategoriya);
    if (!kategoriyaMavjud) {
      throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
    }

    const files = req.files;

    if (!files || !files.rasm_360_tashqi || !files.rasm_360_ichki || !files.model_rasmi) {
      throw CustomErrorHandler.BadRequest(
        "Barcha rasmlar shart: rasm_360_tashqi, rasm_360_ichki, model_rasmi"
      );
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:4001";

    const mashina = await MashinaSchema.create({
      kategoriya,
      nomi,
      tanirovkasi,
      motor: Number(motor),
      yil: Number(yil),
      rang,
      masofa: Number(masofa),
      uzatmalar_qutisi,
      narxi: Number(narxi),
      tavsif,
      rasm_360_tashqi: `${baseUrl}/uploads/${files.rasm_360_tashqi[0].filename}`,
      rasm_360_ichki: `${baseUrl}/uploads/${files.rasm_360_ichki[0].filename}`,
      model_rasmi: `${baseUrl}/uploads/${files.model_rasmi[0].filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Mashina muvaffaqiyatli qo'shildi",
      data: mashina,
    });
  } catch (error) {
    next(error);
  }
};

const updateMashina = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      kategoriya,
      nomi,
      tanirovkasi,
      motor,
      yil,
      rang,
      masofa,
      uzatmalar_qutisi,
      narxi,
      tavsif,
    } = req.body;

    const mashina = await MashinaSchema.findById(id);

    if (!mashina) {
      throw CustomErrorHandler.NotFound("Mashina topilmadi");
    }

    if (kategoriya) {
      const kategoriyaMavjud = await KategoriyaSchema.findById(kategoriya);
      if (!kategoriyaMavjud) {
        throw CustomErrorHandler.NotFound("Kategoriya topilmadi");
      }
    }

    const updateData = {
      kategoriya,
      nomi,
      tanirovkasi,
      motor: motor ? Number(motor) : mashina.motor,
      yil: yil ? Number(yil) : mashina.yil,
      rang,
      masofa: masofa ? Number(masofa) : mashina.masofa,
      uzatmalar_qutisi,
      narxi: narxi ? Number(narxi) : mashina.narxi,
      tavsif,
    };

    const baseUrl = process.env.BASE_URL || "http://localhost:4001";
    const files = req.files;

    if (files) {
      if (files.rasm_360_tashqi) {
        updateData.rasm_360_tashqi = `${baseUrl}/uploads/${files.rasm_360_tashqi[0].filename}`;
      }
      if (files.rasm_360_ichki) {
        updateData.rasm_360_ichki = `${baseUrl}/uploads/${files.rasm_360_ichki[0].filename}`;
      }
      if (files.model_rasmi) {
        updateData.model_rasmi = `${baseUrl}/uploads/${files.model_rasmi[0].filename}`;
      }
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    await MashinaSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      success: true,
      message: "Mashina yangilandi",
    });
  } catch (error) {
    next(error);
  }
};

const deleteMashina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mashina = await MashinaSchema.findById(id);

    if (!mashina) {
      throw CustomErrorHandler.NotFound("Mashina topilmadi");
    }

    await MashinaSchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Mashina o'chirildi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMashinalar,
  getMashinalarByKategoriya,
  getOneMashina,
  searchMashinalar,
  addMashina,
  updateMashina,
  deleteMashina,
};
