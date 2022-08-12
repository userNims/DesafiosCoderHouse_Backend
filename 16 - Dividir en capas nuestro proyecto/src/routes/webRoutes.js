const express = require("express");
const router = express.Router();
const webControllers = require("../controllers/webControllers.js");

// const multer = require("multer");

//* FAIL RUTE
function error404 (require, response){
    let ruta = require.path;
    let metodo = require.method;
    let notFound = 404;
    response.status(notFound).send({error: notFound, description: `la ruta ${ruta} con método ${metodo} no tiene ninguna función implementada`});
};

router.get("/", webControllers.login);
router.get("/main", webControllers.main);
router.post("/login", webControllers.login);
router.get("/faillogin", webControllers.faillogin);
router.post("/signup", webControllers.signup);
router.get("/failsignup", webControllers.failsignup);
router.get("/info", webControllers.info);

router.get("/*", webControllers.pageNotFound);
router.post("/*", webControllers.pageNotFound);
router.put("/*", webControllers.pageNotFound);
router.delete("/*", webControllers.pageNotFound);


module.exports = router;
