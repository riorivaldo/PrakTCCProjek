import express from "express";
import {
  createNote,
  deleteNote,
  getNote,
  updateNote,
} from "../controller/diaryController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Proteksi semua route diary
router.use(verifyToken);

router.get("/note", getNote);
router.post("/add-note", createNote);
router.put("/edit-note/:id", updateNote);
router.delete("/delete-note/:id", deleteNote);

export default router;
