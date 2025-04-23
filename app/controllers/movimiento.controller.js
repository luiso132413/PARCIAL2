const db = require('../config/db.config.js');
const Movimiento = db.Movimientos;
const Cuenta = db.Cuentas;
const { Op } = require('sequelize');

// Crear un nuevo movimiento
exports.create = async (req, res) => {
    try {
        // Validar que la cuenta exista
        const cuenta = await Cuenta.findByPk(req.body.id_cuenta);
        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.body.id_cuenta
            });
        }

        // Validar el tipo de movimiento
        const tiposPermitidos = [
            'Deposito Efectivo', 
            'Deposito Cheque', 
            'Retiro Efectivo', 
            'Retiro Cheque', 
            'Cambio de Moneda', 
            'Pago de Servicio'
        ];
        
        if (!tiposPermitidos.includes(req.body.tipo_movimiento)) {
            return res.status(400).json({
                message: "Tipo de movimiento inválido",
                tipos_permitidos: tiposPermitidos
            });
        }

        // Validar monto positivo
        if (req.body.monto <= 0) {
            return res.status(400).json({
                message: "El monto debe ser mayor que cero"
            });
        }

        // Crear el movimiento
        const movimiento = await Movimiento.create({
            id_cuenta: req.body.id_cuenta,
            tipo_movimiento: req.body.tipo_movimiento,
            monto: req.body.monto,
            descripcion: req.body.descripcion || '',
            validado: req.body.validado || false,
            limite_excedido: req.body.limite_excedido || false
        });

        res.status(201).json({
            message: "Movimiento creado exitosamente",
            movimiento: movimiento
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el movimiento",
            error: error.message
        });
    }
}

// Obtener todos los movimientos
exports.retrieveAllMovimientos = async (req, res) => {
    try {
        const movimientos = await Movimiento.findAll({
            include: [{
                model: Cuenta,
                attributes: ['id_cuenta', 'tipo_cuenta', 'saldo'],
                include: [{
                    model: db.Clientes,
                    attributes: ['nombre']
                }]
            }],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            message: "Movimientos obtenidos exitosamente",
            count: movimientos.length,
            movimientos: movimientos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener movimientos",
            error: error.message
        });
    }
}

// Obtener un movimiento por ID
exports.getMovimientoById = async (req, res) => {
    try {
        const movimiento = await Movimiento.findByPk(req.params.id, {
            include: [{
                model: Cuenta,
                include: [{
                    model: db.Clientes,
                    attributes: ['nombre', 'dpi']
                }]
            }]
        });

        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.params.id
            });
        }

        res.status(200).json({
            message: "Movimiento encontrado",
            movimiento: movimiento
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar el movimiento",
            error: error.message
        });
    }
}

// Actualizar un movimiento
exports.updateById = async (req, res) => {
    try {
        const movimiento = await Movimiento.findByPk(req.params.id);
        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.params.id
            });
        }

        // Validaciones para actualización
        if (req.body.tipo_movimiento) {
            const tiposPermitidos = [
                'Deposito Efectivo', 'Deposito Cheque', 
                'Retiro Efectivo', 'Retiro Cheque', 
                'Cambio de Moneda', 'Pago de Servicio'
            ];
            
            if (!tiposPermitidos.includes(req.body.tipo_movimiento)) {
                return res.status(400).json({
                    message: "Tipo de movimiento inválido"
                });
            }
        }

        if (req.body.monto && req.body.monto <= 0) {
            return res.status(400).json({
                message: "El monto debe ser mayor que cero"
            });
        }

        // Campos actualizables
        const updateData = {
            tipo_movimiento: req.body.tipo_movimiento || movimiento.tipo_movimiento,
            monto: req.body.monto || movimiento.monto,
            descripcion: req.body.descripcion || movimiento.descripcion,
            validado: req.body.validado !== undefined ? req.body.validado : movimiento.validado,
            limite_excedido: req.body.limite_excedido !== undefined ? req.body.limite_excedido : movimiento.limite_excedido
        };

        await Movimiento.update(updateData, {
            where: { id_movimiento: req.params.id }
        });

        const movimientoActualizado = await Movimiento.findByPk(req.params.id);

        res.status(200).json({
            message: "Movimiento actualizado exitosamente",
            movimiento: movimientoActualizado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el movimiento",
            error: error.message
        });
    }
}

// Validar un movimiento
exports.validarMovimiento = async (req, res) => {
    try {
        const movimiento = await Movimiento.findByPk(req.params.id);
        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.params.id
            });
        }

        if (movimiento.validado) {
            return res.status(400).json({
                message: "El movimiento ya está validado"
            });
        }

        await Movimiento.update({ validado: true }, {
            where: { id_movimiento: req.params.id }
        });

        res.status(200).json({
            message: "Movimiento validado exitosamente",
            movimiento: await Movimiento.findByPk(req.params.id)
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al validar el movimiento",
            error: error.message
        });
    }
}

// Obtener movimientos por cuenta
exports.getMovimientosByCuenta = async (req, res) => {
    try {
        const cuenta = await Cuenta.findByPk(req.params.idCuenta);
        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.params.idCuenta
            });
        }

        const movimientos = await Movimiento.findAll({
            where: { id_cuenta: req.params.idCuenta },
            include: [{
                model: Cuenta,
                attributes: ['tipo_cuenta']
            }],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            message: `Movimientos de la cuenta ${req.params.idCuenta}`,
            cuenta: {
                id: cuenta.id_cuenta,
                tipo: cuenta.tipo_cuenta,
                saldo: cuenta.saldo
            },
            count: movimientos.length,
            movimientos: movimientos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener movimientos de la cuenta",
            error: error.message
        });
    }
}

// Obtener movimientos por rango de fechas
exports.getMovimientosByFecha = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({
                message: "Debe proporcionar fechaInicio y fechaFin como parámetros de consulta"
            });
        }

        const movimientos = await Movimiento.findAll({
            where: {
                fecha: {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
                }
            },
            include: [{
                model: Cuenta,
                include: [{
                    model: db.Clientes,
                    attributes: ['nombre']
                }]
            }],
            order: [['fecha', 'DESC']]
        });

        res.status(200).json({
            message: `Movimientos entre ${fechaInicio} y ${fechaFin}`,
            count: movimientos.length,
            movimientos: movimientos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener movimientos por fecha",
            error: error.message
        });
    }
}

// Eliminar un movimiento
exports.deleteById = async (req, res) => {
    try {
        const movimiento = await Movimiento.findByPk(req.params.id);
        if (!movimiento) {
            return res.status(404).json({
                message: "Movimiento no encontrado con id = " + req.params.id
            });
        }

        // Solo permitir eliminar movimientos no validados
        if (movimiento.validado) {
            return res.status(400).json({
                message: "No se puede eliminar un movimiento validado"
            });
        }

        await movimiento.destroy();
        res.status(200).json({
            message: "Movimiento eliminado exitosamente",
            movimiento: movimiento
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el movimiento",
            error: error.message
        });
    }
}
