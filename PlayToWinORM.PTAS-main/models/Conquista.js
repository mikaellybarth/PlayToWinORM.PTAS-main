//descricao e titulo

const db = require("../db/conn");
const { DataTypes } = require("sequelize");
const Jogo = require("../models/Jogo");

const Conquista = db.define(
  "Conquista",
  {
    titulo: {
      type: DataTypes.STRING,
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
