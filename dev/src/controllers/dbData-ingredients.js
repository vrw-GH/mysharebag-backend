// --------  SELECT A DATABASE FROM HERE ----
// import { queryDB, changeDB, deleteDB } from "../db/db-pg.js"; //
import { queryDB, changeDB, deleteDB } from "../db/db-mysql.js";

// ------ fields list  ---------
// ??

export const getAllEL = (table, fields) => {
  return queryDB(`SELECT ${fields} FROM ${table};`);
};

export const getOneEL = (table, id) => {
  const fields = "*";
  const pKey = "ingredient_id";
  return queryDB(`SELECT ${fields} FROM ${table} WHERE ${pKey} = $1;`, [id]);
};

export const createEL = (table, element) => {
  const fields = "(ingredient_name, ingredient_unit) VALUES($1, $2)";
  return changeDB(`INSERT INTO ${table} ${fields} ;`, [
    element.ingredient_name.trim(),
    element.ingredient_unit.trim(),
  ]);
};

export const updateEL = (table, element, id) => {
  const fields = "(ingredient_name, ingredient_unit) = ($2, $3)";
  const pKey = "ingredient_id";
  return changeDB(`UPDATE ${table} SET ${fields} WHERE ${pKey} = $1;`, [
    id,
    element.ingredient_name.trim(),
    element.ingredient_unit.trim(),
  ]);
};

export const deleteEL = (table, id) => {
  const pKey = "ingredient_id";
  return deleteDB(`DELETE FROM ${table} WHERE ${pKey} = $1;`, [id]);
};
