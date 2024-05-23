// ------------ CONFIGURE APP settings -----------

// ------------ MODULES  -----------
import fs from "fs";
import dotenv from "dotenv";
// import ld from "lodash";

// import { createRequire } from "module"; //as workaround for selective imports
// const require = createRequire(import.meta.url);
// const ld = require("lodash");

// ------------ Get Package & ENVs  -----------
const packageJSON = JSON.parse(fs.readFileSync("./package.json"));
let envs;
try {
   const result = dotenv.config();
   if (!("error" in result)) {
      envs = result.parsed;
      console.log("ENV processed using dotenv.");
   }
} catch (e) {
   console.log("Try LODASH for ENV processing.");
   process.exit();
   // envs = {};
   // ld.each(process.env, (value, key) => (envs[key] = value));
   // console.log("ENV processed using lodash.");
};

const APPDATA = {
   TITLE: packageJSON.name || "new-node-project",
   NAME: packageJSON.name
      .replace(/-/g, " ")
      .replace(/(^\w{1})|(\s+\w{1})/g, (chr) => chr.toUpperCase()) || "New Node Project",
   VER: "v" + packageJSON.version || "0.0.1",
   INFO: packageJSON.info || "Rest (API) backend",
   DESCRIPTION: packageJSON.description || "new project for backend",
   FLIGHT: process.env.NODE_APP_FLIGHT || "",
   DEVELOPER: packageJSON.developer, // is{}
   WEBSITE:
      process.env.WEBDEPLOY || packageJSON.sites.live
      || packageJSON.sites.alpha || packageJSON.sites.beta
      || "",
   ROOT: "/",
   HOST: "http://" +
      (process.env.HOST ? process.env.HOST.replace('http://', '').replace('https://', '') : false
         || process.env.LOGONSERVER ? process.env.LOGONSERVER.replace('\\\\', '') : false
      || "localhost"),
   PORT: process.env.PORT || 5000,
};

if (process.env.NODE_ENV.substring(0, 3).toUpperCase() === "DEV") {
   console.info("============ APPDATA ================");
   // console.log("ENV:- \n" + JSON.stringify(process.env) + "\n--------------------");
   console.info(APPDATA);
};


export default APPDATA;