import { Router } from "express";
import slug from "slug";
import {
  getAllEL,
  getOneEL,
  createEL,
  updateEL,
  deleteEL,
} from "../controllers/dbData-recipes.js";
// TODO import ErrorResponse from "../utils/errorResponse.js";

const dbTable = "recipes";
const fields = [
  // <fieldname> , <when creating> , <can update>
  "title",
  "category",
  "ingredients",
  "recipe",
  "image",
  "title_img", // bytea
  "username",
];
const keyField = fields[0];

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
    // other validations
    return element;
  } catch (err) {
    throw Error(`Data validation failed- ${err.message}.`);
  }
};

const recipesRouter = Router(); //* "/api/recipes"
recipesRouter
  .route("/")
  .get(async (req, res) => {
    //                                         get all tuples
    try {
      const tuples = await getAllEL(
        dbTable,
        "title, category, image, title_img, ingredients, username, slug"
      );
      const info = {
        result: true,
        message: `All ${dbTable} list.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `No data found.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    //                                         create new tuple
    try {
      await getOneEL(dbTable, req.body[keyField]);
      const info = {
        result: false,
        message: `<${req.body[keyField]}> slug already exists.`,
      };
      res.status(406).json({ info, sysMessage: null });
    } catch (err) {
      try {
        const newElement = validateElement(req.body); // generates error if invalid
        // console.log("1");
        const tuples = await createEL(dbTable, newElement);
        // console.log("2");
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

recipesRouter
  .route("/:id")
  .get(async (req, res) => {
    //                                         get single tuple
    const idKey = slug(req.params.id.trim().slice(0, 40));
    try {
      const tuples = await getOneEL(dbTable, idKey);
      const info = {
        result: true,
        message: `${dbTable} info for <${req.params.id}>.`,
        records: tuples.length,
      };
      res.json({ info, tuples });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> (no slug found).`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .post(async (req, res) => {
    //                                         update single tuple
    const idKey = slug(req.params.id.trim().slice(0, 40));
    try {
      let tuples = await getOneEL(dbTable, idKey);
      if (!tuples)
        throw Error(`${dbTable} <${req.params.id}> (couldnt find data).`);
      const newElement = validateElement(req.body); // generates error if invalid
      tuples = await updateEL(dbTable, newElement, idKey);
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
        message: `${dbTable} <${req.params.id}>.`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  })
  .delete(async (req, res) => {
    //  Confirm...                     make sure!! - implement at front-end ?
    const idKey = slug(req.params.id.trim().slice(0, 40));
    try {
      const tuples = await getOneEL(dbTable, idKey);
      if (!tuples) throw Error(`Error in delete operation.`);
      await deleteEL(dbTable, idKey);
      const info = {
        result: true,
        message: `${dbTable} <${req.params.id}> DELETED.`,
      };
      res.json({ info });
    } catch (error) {
      const info = {
        result: false,
        message: `${dbTable} <${req.params.id}> (slug does not exist).`,
      };
      res.status(404).json({ info, sysMessage: error.message });
    }
  });

export default recipesRouter;
