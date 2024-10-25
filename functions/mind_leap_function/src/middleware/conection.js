//DB MySQL Conexion
const catalyst = require('zcatalyst-sdk-node');
// const app = catalyst.initialize();


const mysql = require('mysql2/promise');
let zcql;
//const datastore = app.datastore()

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'MindLeap',
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

class Database {
  static async connect(req) {
    if (catalyst){
      const app = catalyst.initialize(req);
      const zcql= app.zcql();
      return zcql;
    }
    if (!this.connection) {
      this.connection = await mysql.createConnection(connectionString);
    }
    return this.connection;
  }
}

module.exports = { Database };