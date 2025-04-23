const express = require('express');
const router = express.Router();

// Importar controladores
const cliente = require('../controllers/cliente.controller.js');
const cuenta = require('../controllers/cuenta.controller.js');
const movimiento = require('../controllers/movimiento.controller.js');
const transaccion = require('../controllers/transaccion.controller.js');

// Rutas para Clientes
router.post('/api/cliente/create', cliente.create);
router.get('/api/cliente/all', cliente.retrieveAllClientes);
router.get('/api/cliente/onebyid/:id', cliente.getClienteById);
router.get('/api/cliente/bydpi/:dpi', cliente.getClienteByDpi);
router.put('/api/cliente/update/:id', cliente.updateById);
router.delete('/api/cliente/delete/:id', cliente.deleteById);

// Rutas para Cuentas
router.post('/api/cuenta/create', cuenta.create);
router.get('/api/cuenta/all', cuenta.retrieveAllCuentas);
router.get('/api/cuenta/onebyid/:id', cuenta.getCuentaById);
router.get('/api/cuenta/bycliente/:idCliente', cuenta.getCuentasByCliente);
router.put('/api/cuenta/update/:id', cuenta.updateById);
router.put('/api/cuenta/cambiarestado/:id', cuenta.cambiarEstado);
router.delete('/api/cuenta/delete/:id', cuenta.deleteById);

// Rutas para Movimientos
router.post('/api/movimiento/create', movimiento.create);
router.get('/api/movimiento/all', movimiento.retrieveAllMovimientos);
router.get('/api/movimiento/onebyid/:id', movimiento.getMovimientoById);
router.get('/api/movimiento/bycuenta/:idCuenta', movimiento.getMovimientosByCuenta);
router.get('/api/movimiento/byfecha', movimiento.getMovimientosByFecha);
router.put('/api/movimiento/update/:id', movimiento.updateById);
router.put('/api/movimiento/validar/:id', movimiento.validarMovimiento);
router.delete('/api/movimiento/delete/:id', movimiento.deleteById);

// Rutas para Transacciones
router.post('/api/transaccion/create', transaccion.create);
router.get('/api/transaccion/all', transaccion.retrieveAllTransacciones);
router.get('/api/transaccion/onebyid/:id', transaccion.getTransaccionById);
router.get('/api/transaccion/bymovimiento/:idMovimiento', transaccion.getTransaccionesByMovimiento);
router.get('/api/transaccion/byoperador/:operador', transaccion.getTransaccionesByOperador);
router.put('/api/transaccion/update/:id', transaccion.updateById);
router.put('/api/transaccion/validar/:id', transaccion.validarTransaccion);
router.delete('/api/transaccion/delete/:id', transaccion.deleteById);
module.exports = router;