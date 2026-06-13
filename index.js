const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db.config");
const authRouter = require("./router/auth.routes");
const kategoriyaRouter = require("./router/kategoriya.routes");
const mashinaRouter = require("./router/mashina.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads/images")));

connectDB();

app.use(authRouter);
app.use(kategoriyaRouter);
app.use(mashinaRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route topilmadi: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server ishga tushdi: http://localhost:${PORT}`);
});