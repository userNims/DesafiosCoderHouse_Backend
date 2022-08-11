const log4js = require('log4js');

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

const loggerInfo = log4js.getLogger('default');
const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

const path = require("path");

module.exports = {
  home: (req, res) => {
    loggerInfo.info(`Ruta: ${req.originalUrl}, Metodo: ${req.method}`);
    res.render(path.join(__dirname, "../views/pages/index"));
  },
  // carrito: (req, res) => {
  //   res.render(path.join(__dirname, "../views/dinamic/carrito"));
  // },
  // categories: (req, res) => {
  //   res.render(path.join(__dirname, "../views/dinamic/categories"));
  // },

  // aboutus: (req, res) => {
  //   res.render(path.join(__dirname, "../views/static/aboutus"));
  // },
  // contact: (req, res) => {
  //   res.render(path.join(__dirname, "../views/static/contact"));
  // },
  // login: (req, res) => {
  //   res.render(path.join(__dirname, "../views/static/login"));
  // },
};
