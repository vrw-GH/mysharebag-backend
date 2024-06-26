// --------  SELECT A DATABASE FROM HERE ----
// import { queryDB, changeDB, deleteDB } from "../db/db-pg.js";
import { queryDB, changeDB, deleteDB } from "../db/db-mysql.js";

// ------ fields list  ---------
// ??

export const getAllEL = (table, fields) =>
  queryDB(`SELECT ${fields} FROM ${table};`);

export const getOneEL = (table, id) =>
  queryDB(
    `SELECT *  FROM ${table} 
    WHERE LOWER(category_id) = LOWER($1);`,
    [id]
  );

export const createEL = (table, element) => {
  const fields =
    "(category_id, name, description, image ) VALUES($1, $2, $3, $4)";
  return changeDB(`INSERT INTO ${table} ${fields} ;`, [
    element.category_id,
    element.name,
  ]);
};

export const updateEL = (table, element, id) => {
  const fields = "(category_id, name, description, image) = ($1, $2, $3, $4)";
  return changeDB(
    `UPDATE ${table} SET ${fields}
     WHERE LOWER(category_id) = LOWER($1);`,
    [id, element.name.trim()]
  );
};

export const deleteEL = (table, id) => {
  deleteDB(
    `DELETE FROM ${table} 
    WHERE LOWER(category_id) = LOWER($1);`,
    [id]
  );
};
