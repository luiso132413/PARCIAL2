const { password } = require("../config/env");

module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {	
	  id_user: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  name: {
			type: Sequelize.STRING
	  },
	  mail: {
			type: Sequelize.STRING
  	},
	  password: {
			type: Sequelize.STRING
	  },
	  creatiodate: {
			type: Sequelize.DATE
    },
	  
    copyrightby: {
      type: Sequelize.STRING,
      defaultValue: 'UMG Antigua'
    }
	});
	
	return User;
}