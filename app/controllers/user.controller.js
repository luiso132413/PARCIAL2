const db = require('../config/db.config.js');
const User = db.User;

// Crear un nuevo usuario
exports.create = (req, res) => {
    let user = {};

    try {
        // Construyendo el objeto User a partir del cuerpo de la solicitud
        user.name = req.body.name;
        user.mail = req.body.mail;
        user.password = req.body.password; // Asegúrate de hashear la contraseña antes de guardarla
        user.creatiodate = req.body.creatiodate;

        // Guardar en la base de datos MySQL
        User.create(user).then(result => {
            res.status(200).json({
                message: "Usuario creado exitosamente con id = " + result.id_user,
                user: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error!",
            error: error.message,
        });
    }
}

// Obtener todos los usuarios
exports.retrieveAllUsers = (req, res) => {
    User.findAll()
        .then(users => {
            res.status(200).json({
                message: "Usuarios obtenidos exitosamente!",
                users: users,
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

// Obtener un usuario por su id
exports.getUserById = (req, res) => {
    let userId = req.params.id;

    User.findByPk(userId)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: "Usuario no encontrado con id = " + userId,
                });
            } else {
                res.status(200).json({
                    message: "Usuario encontrado con id = " + userId,
                    user: user,
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

// Actualizar un usuario por su id
exports.updateById = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({
                message: "No se encontró el usuario con id = " + userId,
                error: "404",
            });
        } else {
            let updatedObject = {
                name: req.body.name,
                mail: req.body.mail,
                password: req.body.password, // Asegúrate de hashear la contraseña antes de actualizarla
                creatiodate: req.body.creatiodate,
            };

            let result = await User.update(updatedObject, { returning: true, where: { id_user: userId } });

            if (!result) {
                res.status(500).json({
                    message: "Error -> No se pudo actualizar el usuario con id = " + userId,
                    error: "No se pudo actualizar",
                });
            } else {
                res.status(200).json({
                    message: "Usuario actualizado exitosamente con id = " + userId,
                    user: updatedObject,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo actualizar el usuario con id = " + userId,
            error: error.message,
        });
    }
}

// Eliminar un usuario por su id
exports.deleteById = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findByPk(userId);

        if (!user) {
            res.status(404).json({
                message: "No existe un usuario con id = " + userId,
                error: "404",
            });
        } else {
            await user.destroy();
            res.status(200).json({
                message: "Usuario eliminado exitosamente con id = " + userId,
                user: user,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el usuario con id = " + userId,
            error: error.message,
        });
    }
}
