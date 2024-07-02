//descricao e titulo

const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Usuario = require("../models/Jogo");

const Cartao = db.define(
  "Conquista",
  {
    titulo: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Conquista",
  }
);

Conquista.belongsTo(Conquista);
Jogo.hasMany(Conquista);

module.exports = Conquista;
