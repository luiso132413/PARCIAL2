const db = require('../config/db.config.js');
const Cliente = db.Clientes;

// Crear un nuevo cliente
exports.create = (req, res) => {
    let cliente = {};

    try {
        // Construyendo el objeto Cliente a partir del cuerpo de la solicitud
        cliente.nombre = req.body.nombre;
        cliente.dpi = req.body.dpi;
        cliente.nit = req.body.nit;
        cliente.recibo_luz = req.body.recibo_luz;
        cliente.beneficiario = req.body.beneficiario;
        cliente.fecha_registro = req.body.fecha_registro || new Date();

        // Guardar en la base de datos
        Cliente.create(cliente).then(result => {
            res.status(200).json({
                message: "Cliente creado exitosamente con id = " + result.id_cliente,
                cliente: result,
            });
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el cliente!",
            error: error.message,
        });
    }
}

// Obtener todos los clientes
exports.retrieveAllClientes = (req, res) => {
    Cliente.findAll()
        .then(clientes => {
            res.status(200).json({
                message: "Clientes obtenidos exitosamente!",
                clientes: clientes,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error al obtener clientes!",
                error: error,
            });
        });
}

// Obtener un cliente por su id
exports.getClienteById = (req, res) => {
    let clienteId = req.params.id;

    Cliente.findByPk(clienteId)
        .then(cliente => {
            if (!cliente) {
                res.status(404).json({
                    message: "Cliente no encontrado con id = " + clienteId,
                });
            } else {
                res.status(200).json({
                    message: "Cliente encontrado con id = " + clienteId,
                    cliente: cliente,
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error al buscar cliente!",
                error: error,
            });
        });
}

// Actualizar un cliente por su id
exports.updateById = async (req, res) => {
    try {
        let clienteId = req.params.id;
        let cliente = await Cliente.findByPk(clienteId);

        if (!cliente) {
            res.status(404).json({
                message: "No se encontró el cliente con id = " + clienteId,
                error: "404",
            });
        } else {
            let updatedObject = {
                nombre: req.body.nombre,
                dpi: req.body.dpi,
                nit: req.body.nit,
                recibo_luz: req.body.recibo_luz,
                beneficiario: req.body.beneficiario,
                fecha_registro: req.body.fecha_registro
            };

            let result = await Cliente.update(updatedObject, { 
                returning: true, 
                where: { id_cliente: clienteId } 
            });

            if (!result[0]) {
                res.status(500).json({
                    message: "Error -> No se pudo actualizar el cliente con id = " + clienteId,
                    error: "No se pudo actualizar",
                });
            } else {
                // Para obtener el cliente actualizado
                let updatedCliente = await Cliente.findByPk(clienteId);
                res.status(200).json({
                    message: "Cliente actualizado exitosamente con id = " + clienteId,
                    cliente: updatedCliente,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo actualizar el cliente con id = " + clienteId,
            error: error.message,
        });
    }
}

// Eliminar un cliente por su id
exports.deleteById = async (req, res) => {
    try {
        let clienteId = req.params.id;
        let cliente = await Cliente.findByPk(clienteId);

        if (!cliente) {
            res.status(404).json({
                message: "No existe un cliente con id = " + clienteId,
                error: "404",
            });
        } else {
            await cliente.destroy();
            res.status(200).json({
                message: "Cliente eliminado exitosamente con id = " + clienteId,
                cliente: cliente,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> No se pudo eliminar el cliente con id = " + clienteId,
            error: error.message,
        });
    }
}

// Buscar cliente por DPI
exports.getClienteByDpi = (req, res) => {
    let dpi = req.params.dpi;

    Cliente.findOne({ where: { dpi: dpi } })
        .then(cliente => {
            if (!cliente) {
                res.status(404).json({
                    message: "Cliente no encontrado con DPI = " + dpi,
                });
            } else {
                res.status(200).json({
                    message: "Cliente encontrado con DPI = " + dpi,
                    cliente: cliente,
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error al buscar cliente por DPI!",
                error: error,
            });
        });
}