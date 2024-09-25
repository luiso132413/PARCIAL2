
module.exports = (sequelize, Sequelize) => {
	const Song = sequelize.define('song', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  songname: {
			type: Sequelize.STRING
	  },
	  description: {
			type: Sequelize.STRING
  	},
	  artist: {
			type: Sequelize.STRING
	  },
	  time: {
			type: Sequelize.INTEGER
    },
	  extension: {
			type: Sequelize.STRING
	  },
	  album: {
			type: Sequelize.STRING
	  },
	  year: {
			type: Sequelize.INTEGER
	  },
    copyrightby: {
      type: Sequelize.STRING,
      defaultValue: 'UMG Antigua'
    }
	});
	
	return Song;
}