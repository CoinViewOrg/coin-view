import mysql from "mysql2";

declare global {
  var SERVICES: Record<string, any>;
}

function registerService<T>(name: string, initFn: () => T): T {
  if (!global.SERVICES) {
    global.SERVICES = {};
  }
  if (process.env.NODE_ENV === "development") {
    if (!global.SERVICES[name]) {
      global.SERVICES[name] = initFn();
    }
    return global.SERVICES[name];
  }
  return initFn();
}

const connection = registerService("db", () =>
  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    multipleStatements: false,
  })
);

export const querySQL = (query: string, values: Array<Array<any>>) =>
  new Promise((resolve, reject) => {
    try {
      connection.query(query, [...values], function (err, result) {
        if (err) throw err;
        resolve(result);
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
