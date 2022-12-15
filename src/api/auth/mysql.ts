import mysql from "mysql";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: 100,
});

export const querySQL = (query: string) =>
  new Promise((resolve, reject) => {
    try {
      pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(query, function (err, result) {
          if (err) throw err;
          connection.release();
          resolve(result);
        });
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
