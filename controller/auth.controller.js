const bcrypt = require("bcryptjs");
const CustomErrorHandler = require("../error/error");
const AuthSchema = require("../schema/auth.schema");
const sendEmail = require("../utils/email-sender");
const { access_token, refresh_token } = require("../utils/token-generator");

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await AuthSchema.findOne({ email });
    if (existingUser) {
      throw CustomErrorHandler.BadRequest("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const existingUsername = await AuthSchema.findOne({ username });
    if (existingUsername) {
      throw CustomErrorHandler.BadRequest("Bu username allaqachon band");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTime = BigInt(Date.now() + 3 * 60 * 1000); // 3 daqiqa

    const hashedPassword = await bcrypt.hash(password, 10);

    await AuthSchema.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpTime,
    });

    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Ro'yxatdan o'tdingiz! Emailingizga tasdiqlash kodi yuborildi.",
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await AuthSchema.findOne({ email });

    if (!user) {
      throw CustomErrorHandler.NotFound("Foydalanuvchi topilmadi");
    }

    if (user.otp !== otp) {
      throw CustomErrorHandler.BadRequest("Tasdiqlash kodi noto'g'ri");
    }

    const now = BigInt(Date.now());
    if (now > user.otpTime) {
      throw CustomErrorHandler.BadRequest("Tasdiqlash kodi muddati o'tgan");
    }

    await AuthSchema.updateOne({ email }, { otp: "", otpTime: BigInt(0) });

    res.status(200).json({
      success: true,
      message: "Email muvaffaqiyatli tasdiqlandi! Endi tizimga kirishingiz mumkin.",
    });
  } catch (error) {
    next(error);
  }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await AuthSchema.findOne({ email });

    if (!user) {
      throw CustomErrorHandler.NotFound("Email yoki parol noto'g'ri");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw CustomErrorHandler.BadRequest("Email yoki parol noto'g'ri");
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = access_token(payload);
    const refreshToken = refresh_token(payload);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// OPTIONS /logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Tizimdan chiqildi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  logout,
};
