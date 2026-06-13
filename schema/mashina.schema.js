const { Schema, model } = require("mongoose");

const Mashina = new Schema(
  {
    kategoriya: {
      type: Schema.Types.ObjectId,
      ref: "Kategoriya",
      required: [true, "Mashina kategoriyasini (markasini) ko'rsatish shart"],
    },

    nomi: {
      type: String,
      required: [true, "Mashina nomini kiritish shart"],
      trim: true,
      uppercase: true,
      maxLength: [100, "Nomi 100 belgidan oshmasligi kerak"],
    },

    tanirovkasi: {
      type: String,
      enum: {
        values: ["Yoq", "Bor"],
        message: "{VALUE} - noto'g'ri qiymat. Faqat 'Yoq' yoki 'Bor'",
      },
      default: "Yoq",
    },

    motor: {
      type: Number,
      required: [true, "Motor hajmini kiritish shart"],
      min: [0.5, "Motor hajmi 0.5 dan kichik bo'lishi mumkin emas"],
      max: [10, "Motor hajmi 10 dan katta bo'lishi mumkin emas"],
    },

    yil: {
      type: Number,
      required: [true, "Ishlab chiqarilgan yilini kiritish shart"],
      min: [1990, "1990 yildan oldingi mashinalar qabul qilinmaydi"],
      max: [new Date().getFullYear() + 1, "Kelajakdagi yil kiritilishi mumkin emas"],
    },

    rang: {
      type: String,
      required: [true, "Mashina rangini kiritish shart"],
      trim: true,
    },

    masofa: {
      type: Number,
      required: [true, "Bosib o'tilgan masofani kiritish shart"],
      min: [0, "Masofa manfiy bo'lishi mumkin emas"],
    },

    uzatmalar_qutisi: {
      type: String,
      required: [true, "Uzatmalar qutisi turini kiritish shart"],
      enum: {
        values: ["Avtomat karobka", "Mexanik karobka", "Variator", "Robotlashgan"],
        message: "{VALUE} - bunday uzatmalar qutisi turi mavjud emas",
      },
      default: "Avtomat karobka",
    },

    narxi: {
      type: Number,
      required: [true, "Narxni kiritish shart"],
      min: [0, "Narx manfiy bo'lishi mumkin emas"],
    },

    
    tavsif: {
      type: String,
      required: [true, "Mashina tavsifini kiritish shart"],
      minLength: [10, "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak"],
    },

    rasm_360_tashqi: {
      type: String,
      required: [true, "Tashqi 360° rasm shart"],
    },

    rasm_360_ichki: {
      type: String,
      required: [true, "Ichki 360° rasm shart"],
    },

    model_rasmi: {
      type: String,
      required: [true, "Model rasmi shart"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const MashinaSchema = model("Mashina", Mashina);
module.exports = MashinaSchema;
