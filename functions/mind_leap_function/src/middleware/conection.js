//DB MySQL Conexion
const catalyst = require('zcatalyst-sdk-node')

const mysql = require('mysql2/promise');


const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'MindLeap',
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

class Database {
  static async connect(req) {
    if (catalyst) {
      const app = catalyst.initialize(req)
      // const zcql = app.zcql();
      // const file = app.filestore();
      
      this.connection = app
    }
    return this.connection;
  }
}

module.exports = { Database };