const { password } = require("../config/env");

module.exports = (sequelize, Sequelize) => {
    const Transaccion = sequelize.define('transaccion', {    
        id_transaccion: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_movimiento: {
            type: Sequelize.INTEGER,
            references: {
                model: 'movimientos',
                key: 'id_movimiento'
            }
        },
        operador: {
            type: Sequelize.STRING(100)
        },
        caja: {
            type: Sequelize.INTEGER
        },
        validado: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    
    return Transaccion;
}