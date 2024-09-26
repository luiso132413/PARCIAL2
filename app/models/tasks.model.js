const { password } = require("../config/env");

module.exports = (sequelize, Sequelize) => {
	const Tasks = sequelize.define('tasks', {	
	  id_Tks: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  id_pro: {
			type: Sequelize.STRING
	  },
	  name_tks: {
			type: Sequelize.STRING
  	},
	  status_tks: {
			type: Sequelize.STRING
	  },
	  creatiodate_tks: {
			type: Sequelize.DATE
    },
      duedate_tks: {
        type: Sequelize.DATE
    },
	  
    copyrightby: {
      type: Sequelize.STRING,
      defaultValue: 'UMG Antigua'
    }
	});
	
	return Tasks;
}