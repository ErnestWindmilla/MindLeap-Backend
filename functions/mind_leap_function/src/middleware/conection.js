//DB MySQL Conexion

const mysql = require('mysql2/promise');

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'MindLeap',
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

class Database {
  static async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(connectionString);
    }
    return this.connection;
  }
}

module.exports = { Database };