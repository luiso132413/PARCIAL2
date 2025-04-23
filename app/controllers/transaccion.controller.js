const db = require('../config/db.config.js');
const Transaccion = db.Transacciones;
const Movimiento = db.Movimientos;
const { Op } = require('sequelize');

// Crear una nueva transacción
exports.create = async (req, res) => {
    try {
        // Validar que el movimiento exista
        const movimiento = await Movimiento.findByPk(req.body.id_movimiento);
        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.body.id_movimiento
            });
        }

        // Validar campos requeridos
        if (!req.body.operador || !req.body.caja) {
            return res.status(400).json({
                message: "Los campos 'operador' y 'caja' son obligatorios"
            });
        }

        // Crear la transacción
        const transaccion = await Transaccion.create({
            id_movimiento: req.body.id_movimiento,
            operador: req.body.operador,
            caja: req.body.caja,
            validado: req.body.validado || false
        });

        res.status(201).json({
            message: "Transacción creada exitosamente",
            transaccion: transaccion
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la transacción",
            error: error.message
        });
    }
}

// Obtener todas las transacciones
exports.retrieveAllTransacciones = async (req, res) => {
    try {
        const transacciones = await Transaccion.findAll({
            include: [{
                model: Movimiento,
                include: [{
                    model: db.Cuentas,
                    include: [{
                        model: db.Clientes,
                        attributes: ['nombre']
                    }]
                }]
            }],
            order: [['id_transaccion', 'DESC']]
        });

        res.status(200).json({
            message: "Transacciones obtenidas exitosamente",
            count: transacciones.length,
            transacciones: transacciones
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener transacciones",
            error: error.message
        });
    }
}

// Obtener una transacción por ID
exports.getTransaccionById = async (req, res) => {
    try {
        const transaccion = await Transaccion.findByPk(req.params.id, {
            include: [{
                model: Movimiento,
                include: [{
                    model: db.Cuentas,
                    include: [{
                        model: db.Clientes,
                        attributes: ['nombre', 'dpi']
                    }]
                }]
            }]
        });

        if (!transaccion) {
            return res.status(404).json({
                message: "Transacción no encontrada con id = " + req.params.id
            });
        }

        res.status(200).json({
            message: "Transacción encontrada",
            transaccion: transaccion
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar la transacción",
            error: error.message
        });
    }
}

// Actualizar una transacción
exports.updateById = async (req, res) => {
    try {
        const transaccion = await Transaccion.findByPk(req.params.id);
        if (!transaccion) {
            return res.status(404).json({
                message: "Transacción no encontrada con id = " + req.params.id
            });
        }

        // Validar que el movimiento exista si se está actualizando
        if (req.body.id_movimiento) {
            const movimiento = await Movimiento.findByPk(req.body.id_movimiento);
            if (!movimiento) {
                return res.status(404).json({
                    message: "Movimiento no encontrado con id = " + req.body.id_movimiento
                });
            }
        }

        // Campos actualizables
        const updateData = {
            id_movimiento: req.body.id_movimiento || transaccion.id_movimiento,
            operador: req.body.operador || transaccion.operador,
            caja: req.body.caja || transaccion.caja,
            validado: req.body.validado !== undefined ? req.body.validado : transaccion.validado
        };

        await Transaccion.update(updateData, {
            where: { id_transaccion: req.params.id }
        });

        const transaccionActualizada = await Transaccion.findByPk(req.params.id);

        res.status(200).json({
            message: "Transacción actualizada exitosamente",
            transaccion: transaccionActualizada
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la transacción",
            error: error.message
        });
    }
}

// Validar una transacción
exports.validarTransaccion = async (req, res) => {
    try {
        const transaccion = await Transaccion.findByPk(req.params.id);
        if (!transaccion) {
            return res.status(404).json({
                message: "Transacción no encontrada con id = " + req.params.id
            });
        }

        if (transaccion.validado) {
            return res.status(400).json({
                message: "La transacción ya está validada"
            });
        }

        await Transaccion.update({ validado: true }, {
            where: { id_transaccion: req.params.id }
        });

        res.status(200).json({
            message: "Transacción validada exitosamente",
            transaccion: await Transaccion.findByPk(req.params.id)
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al validar la transacción",
            error: error.message
        });
    }
}

// Obtener transacciones por movimiento
exports.getTransaccionesByMovimiento = async (req, res) => {
    try {
        const movimiento = await Movimiento.findByPk(req.params.idMovimiento);
        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.params.idMovimiento
            });
        }

        const transacciones = await Transaccion.findAll({
            where: { id_movimiento: req.params.idMovimiento },
            include: [{
                model: Movimiento,
                attributes: ['tipo_movimiento', 'monto']
            }],
            order: [['id_transaccion', 'DESC']]
        });

        res.status(200).json({
            message: `Transacciones del movimiento ${req.params.idMovimiento}`,
            movimiento: {
                id: movimiento.id_movimiento,
                tipo: movimiento.tipo_movimiento,
                monto: movimiento.monto
            },
            count: transacciones.length,
            transacciones: transacciones
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener transacciones del movimiento",
            error: error.message
        });
    }
}

// Obtener transacciones por operador
exports.getTransaccionesByOperador = async (req, res) => {
    try {
        const { operador } = req.params;
        
        if (!operador) {
            return res.status(400).json({
                message: "Debe proporcionar el nombre del operador"
            });
        }

        const transacciones = await Transaccion.findAll({
            where: { 
                operador: {
                    [Op.iLike]: `%${operador}%`
                }
            },
            include: [{
                model: Movimiento,
                attributes: ['tipo_movimiento', 'monto', 'fecha']
            }],
            order: [['id_transaccion', 'DESC']]
        });

        res.status(200).json({
            message: `Transacciones del operador ${operador}`,
            count: transacciones.length,
            transacciones: transacciones
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener transacciones por operador",
            error: error.message
        });
    }
}

// Eliminar una transacción
exports.deleteById = async (req, res) => {
    try {
        const transaccion = await Transaccion.findByPk(req.params.id);
        if (!transaccion) {
            return res.status(404).json({
                message: "Transacción no encontrada con id = " + req.params.id
            });
        }

        // Solo permitir eliminar transacciones no validadas
        if (transaccion.validado) {
            return res.status(400).json({
                message: "No se puede eliminar una transacción validada"
            });
        }

        await transaccion.destroy();
        res.status(200).json({
            message: "Transacción eliminada exitosamente",
            transaccion: transaccion
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la transacción",
            error: error.message
        });
    }
}