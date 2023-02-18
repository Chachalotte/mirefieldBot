const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');
/*
 * equivalent to: CREATE TABLE user(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
module.exports = sequelize.define('user', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
	},
	pseudo: Sequelize.STRING,
	perso_id: { type: Sequelize.INTEGER, unique: true },
	avatar: Sequelize.STRING,
});
