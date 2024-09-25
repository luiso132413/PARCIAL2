

const db = require('../config/db.config.js');
const Song = db.Song;

exports.create = (req, res) => {
    let song = {};

    try{
        // Building Song object from upoading request's body
        song.songname = req.body.songname;
        song.description = req.body.description;
        song.artist = req.body.artist;
        song.time = req.body.time;
        song.extension = req.body.extension;
        song.album = req.body.album;
        song.year = req.body.year;
    
        // Save to MySQL database
        Song.create(song).then(result => {    
            // send uploading message to client
            res.status(200).json({
                message: "Upload Successfully a Song with id = " + result.id,
                customer: result,
            });
        });
    }catch(error){
        res.status(500).json({
            message: "Fail!",
            error: error.message
        });
    }
}

exports.retrieveAllSong = (req, res) => {
    // find all Customer information from 
    Song.findAll()
        .then(songInfos => {
            res.status(200).json({
                message: "Get all Customers' Infos Successfully!",
                song: songInfos
            });
        })
        . catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
}

exports.getSongById = (req, res) => {
  // find all Customer information from 
  let songId = req.params.id;
  Song.findByPk(songId)
      .then(song => {
          res.status(200).json({
              message: " Successfully Get a Customer with id = " + songId,
              song: song
          });
      })
      . catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}
 

exports.updateById = async (req, res) => {
    try{
        let songId = req.params.id;
        let song = await Song.findByPk(songId);
    
        if(!song){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a song with id = " + songId,
                customer: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                songname: req.body.songname,
                description: req.body.description,
                artist: req.body.artist,
                time: req.body.time,
                extension: req.body.extension,
                album: req.body.album,
               
            }
            let result = await Song.update(updatedObject, {returning: true, where: {id: songId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a song with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a Song with id = " + songId,
                customer: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a customer with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try{
        let songId = req.params.id;
        let song = await Song.findByPk(songId);

        if(!song){
            res.status(404).json({
                message: "Does Not exist a Song with id = " + songId,
                error: "404",
            });
        } else {
            await song.destroy();
            res.status(200).json({
                message: "Delete Successfully a Song with id = " + songId,
                song: song,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a song with id = " + req.params.id,
            error: error.message,
        });
    }
}