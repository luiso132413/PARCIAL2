
let express = require('express');
let router = express.Router();
 
const song = require('../controllers/controller.js');

router.post('/api/song/create', song.create);
router.get('/api/song/all', song.retrieveAllSong);
router.get('/api/song/onebyid/:id', song.getSongById);
router.put('/api/song/update/:id', song.updateById);
router.delete('/api/song/delete/:id', song.deleteById);

module.exports = router;