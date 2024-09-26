const { password } = require("../config/env");

module.exports = (sequelize, Sequelize) => {
	const Projects = sequelize.define('projects', {	
	  id_pro: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  id_us: {
			type: Sequelize.INTEGER,
	  },
	  name_pro: {
			type: Sequelize.STRING
  	},
	  description: {
			type: Sequelize.STRING
	  },
	  creatiodate_pro: {
			type: Sequelize.DATE
    },
	  
    copyrightby: {
      type: Sequelize.STRING,
      defaultValue: 'UMG Antigua'
    }
	});
	
	return Projects;
}