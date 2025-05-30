import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Category from "./Category.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transactions",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// ✅ Relasi ditaruh SETELAH deklarasi Transaction
Transaction.belongsTo(Category, { foreignKey: "category_id" });

export default Transaction;
