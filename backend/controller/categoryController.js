import Category from "../models/category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil kategori", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan kategori", error: err.message });
  }
};

// ➕ Tambahan:
export const getCategoryById = async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat)
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  res.json(cat);
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const cat = await Category.findByPk(req.params.id);
  if (!cat)
    return res.status(404).json({ message: "Kategori tidak ditemukan" });

  cat.name = name;
  await cat.save();
  res.json(cat);
};

export const deleteCategory = async (req, res) => {
  const deleted = await Category.destroy({ where: { id: req.params.id } });
  if (!deleted)
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  res.json({ message: "Kategori berhasil dihapus" });
};
