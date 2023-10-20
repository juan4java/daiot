const express = require('express')
const routerCommon = express.Router()

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

module.exports = routerCommon