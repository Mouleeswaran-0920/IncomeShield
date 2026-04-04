const { Sequelize } = require('sequelize');
require('dotenv').config();

const isLocal = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost');

const sequelize = isLocal
  ? new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  })
  : new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });

module.exports = sequelize;
