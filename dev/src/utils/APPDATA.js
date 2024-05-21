// ------------ CONFIGURE APP settings -----------

//as workaround for selective import
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from "fs";

// ------------ Get Package & ENVs  -----------
const packageJSON = JSON.parse(fs.readFileSync("./package.json"));
let envs;
try {
   const dotenv = require("dotenv");
   const result = dotenv.config();
   if (!("error" in result)) {
      console.log("ENV processed using dotenv.");
      envs = result.parsed;
   }
} catch (e) {
   console.log("ENV processed using lodash.");
   const ld = require("lodash");
   envs = {};
   ld.each(process.env, (value, key) => (envs[key] = value));
};

const APPDATA = {
   TITLE: packageJSON.name || "new-node-project",
   NAME: packageJSON.name
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "New Node Project",
   VER: "v" + packageJSON.version || "0.0.1",
   INFO: packageJSON.info || "Rest (API) backend",
   DESCRIPTION: packageJSON.description || "new project for backend",
   FLIGHT: process.env.PROJECT_FLIGHT || "Dev.",
   DEVELOPER: packageJSON.developer, // is{}
   WEBSITE: process.env.WEBDEPLOY || packageJSON.sites.live || packageJSON.sites.alpha || packageJSON.sites.beta || "http://127.0.0.1",
   ROOT: __dirname || "/",
   HOST: process.env.HOST || "http://127.0.0.1",
   PORT: process.env.PORT || 5000,
};

export default APPDATA;