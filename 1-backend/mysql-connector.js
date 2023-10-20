//Termine dejando mysql , pero en AWS la base era mariadb, logre que funcionara con esto
const database = require('mysql');
//const database = require('mariadb');

//#SETME! Mi instancia de MARIA DB en AWS tenia solo acceso desde mi ip, pero publica.

const config = {
    connectionLimit: 5,
    host: 'db-daiot.cmg4tftppuis.us-east-1.rds.amazonaws.com',//#SETME
    port: '3306',
    user: 'user',//#SETME
    password: 'pass',//#SETME
    database: 'DAIOT'
}


const pool = database.createPool(config);

pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                console.error('La conexion a la DB se cerró.');
                break;
            case 'ER_CON_COUNT_ERROR':
                console.error('La base de datos tiene muchas conexiones');
                break;
            case 'ECONNREFUSED':
                console.error('La conexion fue rechazada');
        }
    }
    if (connection) {
        console.log(connection)
        connection.release();
    }
    return;
});

async function asyncFunction(sql) {
    let conn;
    try {
  
      conn = await pool.getConnection();
  
      const res = await conn.query(sql);
        return res
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

module.exports = pool;