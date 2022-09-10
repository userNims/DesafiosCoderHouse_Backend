const productoDaos = require('../mongo/productoDaosMongoDB');
const mensajeDaos = require('../mongo/mensajeDaosMongoDB');
const usuarioDaos = require('../mongo/usuarioDaosMongoDB');
const log4js = require('log4js');
const path = require("path");
const loggerInfo = log4js.getLogger('default');
const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

log4js.configure({
  appenders: {
      miLoggerConsole: {type: "console"},
      miLoggerFile_Warn: {type: "file", filename: 'warn.log'},
      miLoggerFile_Error: {type: "file", filename: 'error.log'}
  },
  categories: {
      default: {appenders: ["miLoggerConsole"], level: "info"},
      warn: {appenders: ["miLoggerFile_Warn", "miLoggerConsole"], level: "warn"},
      error: {appenders: ["miLoggerFile_Error", "miLoggerConsole"], level: "error"}
  }
});

module.exports = {
  login: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.render(path.join(__dirname, "../views/pages/index"));
  },
  main: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);

    res.render(path.join(__dirname, "../views/pages/main"));
  },
  login: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    if (req.isAuthenticated()) {
        //? req.user porque es lo que devuelve el LocalStrategy con su calback en login
        res.cookie('email', req.user.id).cookie('alias', req.user.alias).redirect('/main');
    }
  },
  faillogin: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.cookie('initErr', true, { maxAge: 1000 }).redirect('/')
  },
  signup: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    if (req.isAuthenticated()) {
        res.cookie('alias', req.body.alias).redirect('/');
    }
  },
  failsignup: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.cookie('registerErr', true, { maxAge: 1000 }).redirect('/')
  },
  info: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    let info = {
        os: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage,
        cwd: process.cwd(),
        idProcess: process.pid,
        execPath: process.execPath
    };
    res.send(info);
  },
  pageNotFound: (req, res) => {
    loggerWarn.warn(`Ruta: ${require.originalUrl}, Metodo: ${require.method}`);
    error404(require, response);
  },
};
