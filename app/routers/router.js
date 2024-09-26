let express = require('express');
let router = express.Router();
 
const user = require('../controllers/user.controller.js');
const projects = require('../controllers/projects.controller.js');
const tasks = require('../controllers/tasks.controller.js');

// Rutas de los Usuarios
router.post('/api/user/create', user.create);
router.get('/api/user/all', user.retrieveAllUsers);
router.get('/api/user/onebyid/:id', user.getUserById);
router.put('/api/user/update/:id', user.updateById);
router.delete('/api/user/delete/:id', user.deleteById);

// Rutas de los Proyectos
router.post('/api/project/create', projects.create);
router.get('/api/project/all', projects.retrieveAllProjects);
router.get('/api/project/onebyid/:id', projects.getProjectById);
router.put('/api/project/update/:id', projects.updateById);
router.delete('/api/project/delete/:id', projects.deleteById);

// Rutas de las Tareas
router.post('/api/task/create', tasks.create);
router.get('/api/task/all', tasks.retrieveAllTasks);
router.get('/api/task/onebyid/:id', tasks.getTaskById);
router.put('/api/task/update/:id', tasks.updateById);
router.delete('/api/task/delete/:id', tasks.deleteById);

module.exports = router;
