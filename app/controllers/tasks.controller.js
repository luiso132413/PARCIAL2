const db = require('../config/db.config.js');
const Tasks = db.Tasks;

// Crear una nueva tarea
exports.create = (req, res) => {
    let task = {};

    try {
        // Construyendo el objeto Tasks a partir del cuerpo de la solicitud
        task.id_pro = req.body.id_pro;
        task.name_tks = req.body.name_tks;
        task.status_tks = req.body.status_tks;
        task.creatiodate_tks = req.body.creatiodate_tks;
        task.duedate_tks = req.body.duedate_tks;

        // Guardar en la base de datos MySQL
        Tasks.create(task).then(result => {
            res.status(200).json({
                message: "Tarea creada exitosamente con id = " + result.id_Tks,
                task: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error!",
            error: error.message,
        });
    }
}

// Obtener todas las tareas
exports.retrieveAllTasks = (req, res) => {
    Tasks.findAll()
        .then(tasks => {
            res.status(200).json({
                message: "Tareas obtenidas exitosamente!",
                tasks: tasks,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error,
            });
        });
}

// Obtener una tarea por su id
exports.getTaskById = (req, res) => {
    let taskId = req.params.id;

    Tasks.findByPk(taskId)
        .then(task => {
            if (!task) {
                res.status(404).json({
                    message: "Tarea no encontrada con id = " + taskId,
                });
            } else {
                res.status(200).json({
                    message: "Tarea encontrada con id = " + taskId,
                    task: task,
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error,
            });
        });
}

// Actualizar una tarea por su id
exports.updateById = async (req, res) => {
    try {
        let taskId = req.params.id;
        let task = await Tasks.findByPk(taskId);

        if (!task) {
            res.status(404).json({
                message: "No se encontró la tarea con id = " + taskId,
                error: "404",
            });
        } else {
            let updatedObject = {
                id_pro: req.body.id_pro,
                name_tks: req.body.name_tks,
                status_tks: req.body.status_tks,
                creatiodate_tks: req.body.creatiodate_tks,
                duedate_tks: req.body.duedate_tks,
            };

            let result = await Tasks.update(updatedObject, { returning: true, where: { id_Tks: taskId } });

            if (!result[0]) { // result[0] contiene el número de filas afectadas
                res.status(500).json({
                    message: "Error -> No se pudo actualizar la tarea con id = " + taskId,
                    error: "No se pudo actualizar",
                });
            } else {
                res.status(200).json({
                    message: "Tarea actualizada exitosamente con id = " + taskId,
                    task: updatedObject,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo actualizar la tarea con id = " + taskId,
            error: error.message,
        });
    }
}

// Eliminar una tarea por su id
exports.deleteById = async (req, res) => {
    try {
        let taskId = req.params.id;
        let task = await Tasks.findByPk(taskId);

        if (!task) {
            res.status(404).json({
                message: "No existe una tarea con id = " + taskId,
                error: "404",
            });
        } else {
            await task.destroy();
            res.status(200).json({
                message: "Tarea eliminada exitosamente con id = " + taskId,
                task: task,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar la tarea con id = " + taskId,
            error: error.message,
        });
    }
}
