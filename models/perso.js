const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');
/*
 * equivalent to: CREATE TABLE perso(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * personame VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
module.exports = sequelize.define('perso', {
	id: {
		type: Sequelize.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true,
	},
	nom: Sequelize.STRING,
	prenom: Sequelize.STRING,
	description: Sequelize.TEXT,
	compPerso: Sequelize.TEXT,
	money: Sequelize.INTEGER,
	inv_id: Sequelize.INTEGER,

	avatar: Sequelize.STRING,
});
