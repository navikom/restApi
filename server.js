/* global __dirname, done */

/**
 * Sample API build using Swagger by Wordnik, based loosly on their
 * swagger-node-express example at https://github.com/wordnik/swagger-node-express
 *
 * @author Dan Giulvezan
 *
 * @requires express    Routing module
 * @requires url      Allows the URL to be read
 * @requires fs        Provides access to the servers file system
 * @requires colors      Lets the app show colored output in the console window
 * @requires swagger    Generates the API docs dynamically
 * @requires express-extras  Adds additional middleware options to express; used for throttling
 *
 * @uses config.js
 * @uses api.js
 * @uses models/*
 *
 * @beta
 */

require('dotenv').config();

const express = require("express");
const url = require("url");
const fs = require('fs');
const color = require('colors');
const logger = require('morgan');
const extras = require('express-extras');
const api = require('./api');
const util = require('util');
const bodyParser = require('body-parser');
const passport = require('passport');
const CONFIG = require('./config/config');

const app = express();
const swagger = require('swagger-node-express').createNew(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

const { passportStrategy, passportForRoute } = require('./middleware/passport');
passportStrategy(passport);
const passportSupplier = passportForRoute(passport);

// Setup throttling to keep users from abusing the API
app.use(extras.throttle({
  urlCount: 100,
  urlSec: 1,
  holdTime: 10
}));

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `1234`.  All other HTTP ops are A-OK
swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      if (!apiKey) {
        apiKey = url.parse(req.url, true).query["api_key"];
      }
      if (CONFIG.api_key == apiKey) {
        return true;
      }
      return false;
    }
    return true;
  }
);

// Find all of the model files in the 'models' folder and add the their definitions to swagger
// so it can be displayed in the docs
const models = { "models": {} },
  modelPath = 'models';
require("fs").readdirSync(modelPath).forEach((file) => {
  console.log('Load models from - ' + file);
  const outMod = require('./' + modelPath + '/' + file).model;
  for (let atr in outMod) {
    models.models[atr] = outMod[atr];
  }
});
swagger.addModels(models);

// Add methods to swagger
swagger
  .addGet(api.Carrier.getAllCarriers)
  .addGet(api.Manufacture.getAllManufacturers)
  .addGet(api.Phone.getAllPhones)
  .addGet(api.Carrier.getCarrierById)
  .addGet(api.Manufacture.getManufacturerById)
  .addGet(api.Phone.getPhoneById)
  .addGet(passportSupplier(api.Dashboard.dashboard))

  .addPost(api.Carrier.addCarrier)
  .addPost(api.Manufacture.addManufacturer)
  .addPost(api.Phone.addPhone)
  .addPost(api.Phone.addPhones)
  .addPost(api.User.create)
  .addPost(api.User.login)

  .addPut(api.Carrier.updateCarrier)
  .addPut(api.Manufacture.updateManufacturer)
  .addPut(api.Phone.updatePhone)

  .addDelete(api.Carrier.deleteCarrier)
  .addDelete(api.Manufacture.deleteManufacturer)
  .addDelete(api.Phone.deletePhone);

// set api info
swagger.setApiInfo({
  title: "Swagger app for cell phone, manufacturer, and carrier data",
  description: "This is an API for a database of cell phones, manufacturers, and carriers. " +
  "For this API, you can use the api key \"1234\" to test the authorization filters",
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure(`http://localhost:${CONFIG.port}`, "1.0.0");

// Serve up swagger ui at /docs via static route
const docs_handler = express.static(__dirname + '/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, (req, res, next) => {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location': req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});


// Start the server on port 8002
app.listen(CONFIG.port);
