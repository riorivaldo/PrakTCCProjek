import Transaction from "../models/Transaction.js";
import Category from "../models/category.js";

export const getTransactionsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const transactions = await Transaction.findAll({
      where: { user_id },
      include: Category, // ⬅️ tambahkan ini
      order: [["tanggal", "DESC"]],
    });
    res.json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal ambil data transaksi", error: err.message });
  }
};

// Ambil semua transaksi milik user tertentu
export const getTransactions = async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await Transaction.findAll({ where: { user_id } });
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data", error: error.message });
  }
};

// Tambah transaksi baru
export const createTransaction = async (req, res) => {
  const { user_id, tanggal, type, amount, description } = req.body;

  console.log("DATA MASUK:", req.body); // 👈 Tambahkan ini
  try {
    const trx = await Transaction.create({
      user_id,
      tanggal,
      type,
      amount,
      description,
    });
    res.status(201).json(trx);
  } catch (error) {
    console.error("ERROR SAAT CREATE:", error); // 👈 dan ini
    res
      .status(500)
      .json({ message: "Gagal menambahkan transaksi", error: error.message });
  }
};

// Update transaksi
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { tanggal, type, amount, description } = req.body;
  try {
    await Transaction.update(
      { tanggal, type, amount, description },
      { where: { id } }
    );
    res.status(200).json({ message: "Transaksi berhasil diupdate" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal update transaksi", error: error.message });
  }
};

// Hapus transaksi
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await Transaction.destroy({ where: { id } });
    res.status(200).json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal hapus transaksi", error: error.message });
  }
};
