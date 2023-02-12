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
module.exports = sequelize.define(
	'inventory',
	{
		id: {
			type: Sequelize.INTEGER,
			unique: true,
			autoIncrement: true,
			primaryKey: true,
		},
		name: Sequelize.STRING,
		description: Sequelize.TEXT,
		image: Sequelize.STRING,
	},
	{ timestamps: false },
);
