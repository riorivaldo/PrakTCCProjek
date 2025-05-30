import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controller/transactionController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Proteksi semua route transaksi
router.use(verifyToken);

router.get("/:user_id", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
