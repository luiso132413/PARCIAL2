const { password } = require("../config/env");

module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define('cliente', {    
        id_cliente: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: Sequelize.STRING(100)
        },
        dpi: {
            type: Sequelize.STRING(20),
            unique: true,
            allowNull: false
        },
        nit: {
            type: Sequelize.STRING(20)
        },
        recibo_luz: {
            type: Sequelize.TEXT
        },
        beneficiario: {
            type: Sequelize.STRING(100)
        },
        fecha_registro: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });
    
    return Cliente;
}