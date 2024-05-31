const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');
const User = require('./user-model');
const Item = require('./item-model');

const Bid = sequelize.define('Bid', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  item_id: { type: DataTypes.INTEGER, references: { model: Item, key: 'id' } },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  bid_amount: { type: DataTypes.DECIMAL, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  underscored: true,
});

module.exports = Bid;
