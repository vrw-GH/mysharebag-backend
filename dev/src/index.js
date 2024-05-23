import express from "express";
import cors from "cors";
import path, { dirname, join } from "path";
// import { fileURLToPath } from "url";
// const __dirname = dirname(fileURLToPath(import.meta.url));
// const __dirname = path.resolve(import.meta.dirname);
global.__appRoot = path.resolve(import.meta.dirname);
// console.log("test:" + global.__appRoot);

// ------------ MODULES -----------
import APPDATA from "./utils/APPDATA.js"; //% Load App Configs here
import errorHandler from "./middlewares/errorHandler.js";

// ------------ ROUTES -----------
import baseRoute from "./routes/router0-indexpage.js";
import recipesRouter from "./routes/router1-recipes.js";
import usersRouter from "./routes/router2-users.js";
import categoriesRouter from "./routes/router3-categories.js";
import ingredientsRouter from "./routes/router4-ingredients.js";
import shareitemsRouter from "./routes/router5-shareitems.js";
import plzRouter from "./routes/router6-plz.js";
import authRouter from "./routes/router-auth.js";

const APIendPoints = {
  route0: ["/", "Info Page", baseRoute], //props issue!!
  route1: ["/api/recipes", "API Recipes", recipesRouter],
  route2: ["/api/users", "API Users", usersRouter],
  route3: ["/api/categories", "API Categories", categoriesRouter],
  route4: ["/api/ingredients", "API Ingredients", ingredientsRouter],
  route5: ["/api/shareitems", "API Shareitems", shareitemsRouter],
  route6: ["/api/plz-de", "API PostalCodes DE", plzRouter],
};

// ------------ ATTACH DATAVARIABLES TO ROUTES -----------
baseRoute.appData = APPDATA;
baseRoute.APIendPoints = APIendPoints;
authRouter.appData = APPDATA;

// ------------ MAIN APP -----------
APPDATA.ROOT = global.__appRoot || "/";
const app = express();
// app.set('views', path.join(__dirname, '/views'));
// app.set('views', __dirname + '/views');
app.set("view engine", "ejs"); // looks in root/views folder
app.use(express.json());
const origin = "*"; // {origin: [host, "http://127.0.0.1", "https://abul.db.elephantsql.com/"],}
app.use(
  cors({
    origin,
    optionsSuccessStatus: 200, // some legacy browsers
  })
);
app.use("/uploads", express.static(join(APPDATA.ROOT, "/public/uploads"))); // for serving something (mutler?)
app.use("/public", express.static(join(APPDATA.ROOT, "/public")));

// ----------- iterate all routers  ----
for (let index = 0; index < Object.keys(APIendPoints).length; index++) {
  var key = "route" + index;
  app.use(APIendPoints[key][0], APIendPoints[key][2]);
}
app.use("/auth", authRouter);

// ----------- Handle unknown endpoint ----
app.get("*", (req, res, next) => {
  res.status(404).render("routeless.ejs", { APPDATA });
});

// ----------- Error handling  ----
errorHandler.FLIGHT = APPDATA.FLIGHT;
app.use(errorHandler);

// ----------- Activate server!  ----
app.listen(APPDATA.PORT, () => {
  console.info(
    `\n${APPDATA.NAME.toUpperCase()} (listening...): \n- Server:  ${APPDATA.HOST}:${APPDATA.PORT}\n- Root:    ${APPDATA.ROOT}\n- Website: ${APPDATA.WEBSITE} \n- Flight:  ${APPDATA.FLIGHT}(Env:${process.env.NODE_ENV.substring(0, 3).toUpperCase()})`
  )
}
);
