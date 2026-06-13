const nodemailer = require("nodemailer");
const CustomErrorHandler = require("../error/error");

async function sendEmail(email, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      subject: "CarMarket - Tasdiqlash kodi",
      from: process.env.EMAIL_USER,
      to: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb;">CarMarket</h2>
          <p>Hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
          <b style="color: #2563eb; font-size: 36px; letter-spacing: 4px;">${code}</b>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">Agar siz bu so'rovni yubormagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
        </div>
      `,
    });
  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
}

module.exports = sendEmail;
