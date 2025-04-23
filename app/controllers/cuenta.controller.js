const db = require('../config/db.config.js');
const Cuenta = db.Cuentas;
const Cliente = db.Clientes;

// Crear una nueva cuenta
exports.create = async (req, res) => {
    try {
        // Verificar si el cliente existe
        const cliente = await Cliente.findByPk(req.body.id_cliente);
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado con id = " + req.body.id_cliente
            });
        }

        // Validar el tipo de cuenta
        if (!['Monetaria', 'Ahorro'].includes(req.body.tipo_cuenta)) {
            return res.status(400).json({
                message: "Tipo de cuenta inválido. Debe ser 'Monetaria' o 'Ahorro'"
            });
        }

        // Crear la cuenta
        const cuenta = await Cuenta.create({
            id_cliente: req.body.id_cliente,
            tipo_cuenta: req.body.tipo_cuenta,
            estado: req.body.estado !== undefined ? req.body.estado : true,
            saldo: req.body.saldo || 0.0
        });

        res.status(201).json({
            message: "Cuenta creada exitosamente",
            cuenta: cuenta
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la cuenta",
            error: error.message
        });
    }
}

// Obtener todas las cuentas
exports.retrieveAllCuentas = async (req, res) => {
    try {
        const cuentas = await Cuenta.findAll({
            include: [{
                model: Cliente,
                attributes: ['nombre', 'dpi']
            }]
        });
        
        res.status(200).json({
            message: "Cuentas obtenidas exitosamente",
            cuentas: cuentas
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener cuentas",
            error: error.message
        });
    }
}

// Obtener una cuenta por ID
exports.getCuentaById = async (req, res) => {
    try {
        const cuenta = await Cuenta.findByPk(req.params.id, {
            include: [{
                model: Cliente,
                attributes: ['nombre', 'dpi']
            }]
        });

        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.params.id
            });
        }

        res.status(200).json({
            message: "Cuenta encontrada",
            cuenta: cuenta
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar la cuenta",
            error: error.message
        });
    }
}

// Actualizar una cuenta
exports.updateById = async (req, res) => {
    try {
        const cuenta = await Cuenta.findByPk(req.params.id);
        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.params.id
            });
        }

        // Validar tipo de cuenta si se está actualizando
        if (req.body.tipo_cuenta && !['Monetaria', 'Ahorro'].includes(req.body.tipo_cuenta)) {
            return res.status(400).json({
                message: "Tipo de cuenta inválido. Debe ser 'Monetaria' o 'Ahorro'"
            });
        }

        const updatedData = {
            tipo_cuenta: req.body.tipo_cuenta || cuenta.tipo_cuenta,
            estado: req.body.estado !== undefined ? req.body.estado : cuenta.estado,
            saldo: req.body.saldo || cuenta.saldo
        };

        await Cuenta.update(updatedData, {
            where: { id_cuenta: req.params.id }
        });

        const cuentaActualizada = await Cuenta.findByPk(req.params.id);

        res.status(200).json({
            message: "Cuenta actualizada exitosamente",
            cuenta: cuentaActualizada
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la cuenta",
            error: error.message
        });
    }
}

// Cambiar estado de una cuenta (activar/desactivar)
exports.cambiarEstado = async (req, res) => {
    try {
        const cuenta = await Cuenta.findByPk(req.params.id);
        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.params.id
            });
        }

        const nuevoEstado = !cuenta.estado;
        await Cuenta.update({ estado: nuevoEstado }, {
            where: { id_cuenta: req.params.id }
        });

        res.status(200).json({
            message: `Cuenta ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente`,
            estado: nuevoEstado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al cambiar el estado de la cuenta",
            error: error.message
        });
    }
}

// Obtener cuentas por cliente
exports.getCuentasByCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.idCliente);
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente no encontrado con id = " + req.params.idCliente
            });
        }

        const cuentas = await Cuenta.findAll({
            where: { id_cliente: req.params.idCliente },
            include: [{
                model: Cliente,
                attributes: ['nombre']
            }]
        });

        res.status(200).json({
            message: `Cuentas del cliente ${cliente.nombre}`,
            cliente: {
                id: cliente.id_cliente,
                nombre: cliente.nombre
            },
            cuentas: cuentas
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener cuentas del cliente",
            error: error.message
        });
    }
}

// Eliminar una cuenta
exports.deleteById = async (req, res) => {
    try {
        const cuenta = await Cuenta.findByPk(req.params.id);
        if (!cuenta) {
            return res.status(404).json({
                message: "Cuenta no encontrada con id = " + req.params.id
            });
        }

        // Verificar si la cuenta tiene saldo cero antes de eliminar
        if (parseFloat(cuenta.saldo) !== 0) {
            return res.status(400).json({
                message: "No se puede eliminar la cuenta con saldo diferente de cero",
                saldo: cuenta.saldo
            });
        }

        await cuenta.destroy();
        res.status(200).json({
            message: "Cuenta eliminada exitosamente",
            cuenta: cuenta
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la cuenta",
            error: error.message
        });
    }
}