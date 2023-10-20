const express = require('express')

const routerRegistro = express.Router()

var pool = require('../../mysql-connector');
const routerCommon = require('../common');

routerRegistro.put('/create', function(req, res) {
    var sql = `INSERT INTO log_acciones ( apertura, fecha, tipoId) 
        VALUES ('${req.body.apertura}', '${req.body.fecha}', '${req.body.tipoId}')`; 
    
    var responseAsJson
    pool.query(sql, function(err, result, fields) {
        console.log(result)
        if (err) {
            responseAsJson = handleError(err, res);
        } else {
            var response = `{"message":"Registro insertado", "id":${result.insertId}}`
            responseAsJson = JSON.parse(response)
            res.status(200)
        }
        res.send(result);
    });
})

/**
 * Establece mensaje y status de response
 * @param {*} err 
 * @param {*} res 
 * @returns 
 */
function handleError(err, res) {
    console.error(`Error while connect to DB:  ${err.stack}`);
    responseAsJson = JSON.parse(`{"message":"Fallo al obtener los datoss"}`);
    res.status(503);
    return responseAsJson;
}

module.exports = routerRegistro