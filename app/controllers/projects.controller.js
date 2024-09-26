const db = require('../config/db.config.js');
const Projects = db.Projects;

// Crear un nuevo proyecto
exports.create = (req, res) => {
    let project = {};

    try {
        // Construyendo el objeto Projects a partir del cuerpo de la solicitud
        project.id_us = req.body.id_us;
        project.name_pro = req.body.name_pro;
        project.description = req.body.description;
        project.creatiodate_pro = req.body.creatiodate_pro;

        // Guardar en la base de datos MySQL
        Projects.create(project).then(result => {
            res.status(200).json({
                message: "Proyecto creado exitosamente con id = " + result.id_pro,
                project: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error!",
            error: error.message,
        });
    }
}

// Obtener todos los proyectos
exports.retrieveAllProjects = (req, res) => {
    Projects.findAll()
        .then(projects => {
            res.status(200).json({
                message: "Proyectos obtenidos exitosamente!",
                projects: projects,
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

// Obtener un proyecto por su id
exports.getProjectById = (req, res) => {
    let projectId = req.params.id;

    Projects.findByPk(projectId)
        .then(project => {
            if (!project) {
                res.status(404).json({
                    message: "Proyecto no encontrado con id = " + projectId,
                });
            } else {
                res.status(200).json({
                    message: "Proyecto encontrado con id = " + projectId,
                    project: project,
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

// Actualizar un proyecto por su id
exports.updateById = async (req, res) => {
    try {
        let projectId = req.params.id;
        let project = await Projects.findByPk(projectId);

        if (!project) {
            res.status(404).json({
                message: "No se encontró el proyecto con id = " + projectId,
                error: "404",
            });
        } else {
            let updatedObject = {
                id_us: req.body.id_us,
                name_pro: req.body.name_pro,
                description: req.body.description,
                creatiodate_pro: req.body.creatiodate_pro,
            };

            let result = await Projects.update(updatedObject, { returning: true, where: { id_pro: projectId } });

            if (!result[0]) { // result[0] contiene el número de filas afectadas
                res.status(500).json({
                    message: "Error -> No se pudo actualizar el proyecto con id = " + projectId,
                    error: "No se pudo actualizar",
                });
            } else {
                res.status(200).json({
                    message: "Proyecto actualizado exitosamente con id = " + projectId,
                    project: updatedObject,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo actualizar el proyecto con id = " + projectId,
            error: error.message,
        });
    }
}

// Eliminar un proyecto por su id
exports.deleteById = async (req, res) => {
    try {
        let projectId = req.params.id;
        let project = await Projects.findByPk(projectId);

        if (!project) {
            res.status(404).json({
                message: "No existe un proyecto con id = " + projectId,
                error: "404",
            });
        } else {
            await project.destroy();
            res.status(200).json({
                message: "Proyecto eliminado exitosamente con id = " + projectId,
                project: project,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el proyecto con id = " + projectId,
            error: error.message,
        });
    }
}
