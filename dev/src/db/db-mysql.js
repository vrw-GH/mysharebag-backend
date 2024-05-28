import mysql from "mysql2"; //"mysql"
import ErrorResponse from "../utils/errorResponse.js";

const cxStr = process.env.NODE_APP_DB1;
// protocol://user:pwd//host:port//database
const connectionString = cxStr.split("//");
const conn = mysql.createConnection({
  user: connectionString[1].split(":")[0],
  password: connectionString[1].split(":")[1],
  host: connectionString[2], // may include :port - set in .env
  database: connectionString[3],
});

conn.connect((err) => {
  // console.log(err ? "Cnx:" + connectionString : "");
  !err
    ? console.info(`- DB:      ${connectionString[0]} ${connectionString[2]}/${connectionString[3]}\n`)
    : new ErrorResponse(err.code + " / " + err.errors, 503);
});

// mysql package doesnt work with async, so we have to leverage nodepromises
export const queryDB = (sqlString, values) => {
  return new Promise((resolve, reject) => {
    if (values) {
      conn.query(sqlString, values, (error, results) => {
        !error && results.length > 0
          ? resolve(results) //      returns one tuple
          : reject(
            new ErrorResponse(error || Error("No results returned."), 404)
          );
      });
    } else {
      conn.query(sqlString, (error, results) => {
        if (error) {
          reject(new ErrorResponse(error, 404));
        } else {
          resolve(results);
        }
      });
    }
  });
};

export const changeDB = (sqlString, values) => {
  throw new ErrorResponse(Error("Feature development."), 903);
  // **changeDB  here still gives mySQL Errors!!!!                    - to do

  return new Promise((resolve, reject) => {
    if (values) {
      // sqlString = sqlString.replace(";", "RETURNING *;");
      conn.query(sqlString, values, (error, results) => {
        if (error) reject(error);
        resolve(results.rows); //                   returns a tuple
      });
    } else {
      // not needed! these functions only with values?!
      reject(error);
    }
  });
};

export const deleteDB = (sqlString, values) => {
  //  solve FK problem
  return new Promise((resolve, reject) => {
    if (findDB(values)) {
      sqlString = sqlString.replace("$1", "?");
      conn.query(sqlString, values, (error, results) => {
        error ? reject(new ErrorResponse(error, 404)) : resolve();
      });
    }
  });
};

const findDB = (values) => true; // check for existing
