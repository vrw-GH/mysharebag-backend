import { Router } from "express";
import {
  getAllEL,
  getOneEL,
  createEL,
  updateEL,
  deleteEL,
} from "../controllers/dbData-ingredients.js";
//TODO import ErrorResponse from "../utils/errorResponse.js"

const dbTable = "ingredients";
const fields = ["ingredient_name", "ingredient_unit"];
const keyField = fields[0]; //    *NOT* the auto-id field, but an identifier field

const validateElement = (element) => {
  const tester = element;
  try {
    // console.log(JSON.stringify(tester)); // if not json.
    fields.forEach((e) => {
      if (!tester[e]) {
        console.log(e, ":", tester[e]);
        throw Error(`<${e}> undefined`);
      }
    });
    //                                   other validations go here (?)

    return element;
  } catch (e) {
    throw Error(`Data validation failed- ${e.message}.`);
  }
};

const ingredientsRouter = Router(); //* "/api/ingredients"
ingredientsRouter
  .route("/")
  .get(async (req, res) => {
    //                                         get all tuples
    try {
      const tuples = await getAllEL(
        dbTable,
        "ingredient_id, ingredient_name, ingredient_unit"
      );
      const info = {
        result: true,
        message: `All ${dbTable} list.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = { result: false, message: `No data found.` };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    //                                         creating new tuple
    try {
      await getOneEL(dbTable, req.body[keyField]);
      const info = {
        result: false,
        message: `${keyField} <${req.body[keyField]}> already exists.`,
      };
      res.status(406).json({ info, sysMessage: null });
    } catch (err) {
      try {
        const newElement = validateElement(req.body); // generates error if invalid
        const tuples = await createEL(dbTable, newElement);
        const info = {
          result: true,
          message: `New data for <${req.body[keyField]}> added.`,
          records: tuples.length,
        };
        res.json({ info, tuples });
      } catch (error) {
        const info = {
          result: false,
          message: `Error creating <${req.body[keyField]}>.`,
        };
        res.status(406).json({ info, sysMessage: error.message });
      }
    }
  })
  .delete((req, res) => {
    const info = {
      result: false,
      message: `Delete all data not allowed.`,
    };
    res.status(403).json({ info, sysMessage: "" });
  });

ingredientsRouter
  .route("/:id")
  .get(async (req, res) => {
    //                                         get single tuple
    try {
      const tuples = await getOneEL(dbTable, req.params.id);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}>.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> does not exist.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    //                                         update single tuple
    try {
      let tuples = await getOneEL(dbTable, req.params.id);
      if (!tuples)
        throw Error(`${dbTable} <${req.params.id}> (couldnt find data).`);
      const newElement = validateElement(req.body); // generates error if invalid
      tuples = await updateEL(dbTable, newElement, req.params.id);
      if (!tuples) throw Error(`Update failed.`);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}> updated.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> not existing.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .delete(async (req, res) => {
    //  Confirm...                     make sure!! - implement at front-end ?
    try {
      const tuples = await getOneEL(dbTable, req.params.id);
      if (!tuples) throw Error(`Error in delete operation.`);
      await deleteEL(dbTable, req.params.id);
      const info = {
        result: true,
        message: `${dbTable} <${req.params.id}> DELETED.`,
      };
      res.json({ info });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> does not exist.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  });

export default ingredientsRouter;
