const { Schema, model } = require("mongoose");

const Kategoriya = new Schema(
  {
    nomi: {
      type: String,
      required: [true, "Kategoriya nomini kiritish shart"],
      unique: true,
      trim: true,
      uppercase: true,
      minLength: [2, "Kamida 2 ta harf bo'lishi kerak"],
      maxLength: [50, "Ko'pi bilan 50 ta harf bo'lishi mumkin"],
    },
    rasm: {
      type: String,
      required: [true, "Kategoriya rasmi shart"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const KategoriyaSchema = model("Kategoriya", Kategoriya);
module.exports = KategoriyaSchema;
