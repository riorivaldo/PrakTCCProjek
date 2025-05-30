import dotenv from "dotenv";

import express from "express";
import cors from "cors";

import AuthRoute from "./routes/authRoutes.js";
import TransactionRoute from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();

// Cek environment variable JWT_SECRET saat server start
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET tidak ditemukan di environment variables!");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", AuthRoute);
app.use("/categories", categoryRoutes);
app.use("/transactions", TransactionRoute);
app.use("/goals", goalRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
