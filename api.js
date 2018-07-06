/* global next */
/**
 * All API methods and database connection info
 */
const mongoose = require('mongoose'),
  sw = require('swagger-node-express'),
  colors = require('colors'),
  swe = sw.errors,
  config = require('./config'),
  db = mongoose.connection,
  ObjectId = mongoose.Types.ObjectId;

db.on('error', function() {
  console.log('Database connection error'.red);
});
db.on('connecting', function() {
  console.log('Database connecting'.cyan);
});
db.once('open', function() {
  console.log('Database connection established'.green);
});
db.on('reconnected', function() {
  console.log('Database reconnected'.green);
});

mongoose.connect(config.db_url, {server: {auto_reconnect: true}, useNewUrlParser: true});


/**
 * Load the model files
 */
const Carrier = require('./models/carrier.js');
const Manufacturer = require('./models/manufacturer.js');
const Phone = require('./models/phone.js');


/**
 * All methods and the database connection info for the API
 *
 * Everything inside of "spec" is for the documentation that Swagger generates,
 * everything in "actions" is the business end of things and that's where the
 * actual work is done
 *
 * Inside of spec...
 *  @property path The path used to access the method
 *  @property notes A longer version of what the operation does (shows up in the
 *    "Implementation Notes" part of a methods decription when the method is
 *    expanded on the documentation page)
 *  @property summary Short summary of what the operation does (shows up on the same line as
 *    the "path" when the method is hidden on the documentation page)
 *  @property method The HTTP method used for the Operations
 *  @property parameters Inputs to the methods (can be a blank array if no inputs are needed)
 *  @property type The data type returned by the method. Can be void, a simple-type, a complex,
 or a container (more info at: https://github.com/wordnik/swagger-core/wiki/datatypes)
 *  @property items An array of the model definitions
 *  @property responseMessages Describes how messages from the method maps to the API logic
 *  @property errorResponses Describes how errors messages from the method maps to the API logic
 *  @property nickname Used to provide a shebang (#!) in the swagger-ui
 */

/**
 * List methods
 */
exports.getAllCarriers = {
  'spec': {
    description: "List all phone carriers",
    path: "/carrier/list",
    method: "GET",
    summary: "List all phone carriers",
    notes: "Returns a list of all phone carriers",
    type: "Carrier",
    nickname: "getAllCarriers",
    produces: ["application/json"],
    parameters: [],
    responseMessages: [swe.invalid('carriers'), swe.notFound('carriers')]
  },
  'action': async (req, res) => {
    try {
      const carriers = await Carrier.model.find();
      res.send(carriers);
    } catch (e) {
      res.status(404).send(e);
    }
  }
};

exports.getAllManufacturers = {
  'spec': {
    description: "List all phone manufacturers",
    path: "/manufacturer/list",
    method: "GET",
    summary: "List all phone manufacturers",
    notes: "Returns a list of all phone manufacturers",
    type: "Manufacturer",
    nickname: "getAllManufacturers",
    produces: ["application/json"],
    parameters: [],
    responseMessages: [swe.invalid('manufacturers'), swe.notFound('manufacturers')]
  },
  'action': async (req, res) => {
    try {
      const manufacturers = await Manufacturer.model.find();
      res.send(manufacturers);
    } catch (e) {
      res.status(404).send(e);
    }
  }
};

exports.getAllPhones = {
  'spec': {
    description: "List all phone models",
    path: "/phone/list",
    method: "GET",
    summary: "List all phone models",
    notes: "Returns a list of all phone models",
    type: "Phone",
    nickname: "getAllPhones",
    produces: ["application/json"],
    parameters: [],
    responseMessages: [swe.invalid('phones'), swe.notFound('phones')]
  },
  'action': async (req, res) => {
    try {
      const phone = await Phone.model.find();
      res.send(phone);
    } catch (e) {
      res.status(404).send(e);
    }
  }
};

/**
 * Get record by ID methods
 */
exports.getCarrierById = {
  'spec': {
    description: "Operations about carriers",
    path: "/carrier/{carrierId}",
    method: "GET",
    summary: "Find carrier by ID",
    notes: "Returns a carrier based on ID",
    type: "Carrier",
    nickname: "getCarrierById",
    produces: ["application/json"],
    parameters: [sw.pathParam("carrierId", "ID of the carrier to return", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('carrier')]
  },
  'action': async (req, res) => {
    try {
      const carrier = await Carrier.model.findById(req.params.carrierId);
      res.send(carrier);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

exports.getManufacturerById = {
  'spec': {
    description: "Operations about manufacturers",
    path: "/manufacturer/{manufId}",
    method: "GET",
    summary: "Find manufacturer by ID",
    notes: "Returns a manufacturer based on ID",
    type: "Manufacturer",
    nickname: "getManufacturerById",
    produces: ["application/json"],
    parameters: [sw.pathParam("manufId", "ID of the manufacturer to return", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('manufacturer')]
  },
  'action': async (req, res) => {
    try {
      const manufacturer = await Manufacturer.model.findOne({_id: req.params.manufId});
      res.send(manufacturer);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

exports.getPhoneById = {
  'spec': {
    description: "Operations about phones",
    path: "/phone/{phoneId}",
    method: "GET",
    summary: "Find phone by ID",
    notes: "Returns a phone based on ID",
    type: "Phone",
    nickname: "getPhoneById",
    produces: ["application/json"],
    parameters: [sw.pathParam("phoneId", "ID of the phone to return", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('phone')]
  },
  'action': async (req, res) => {
    try {
      const phone = await Phone.model.findOne({_id: req.params.manufId});
      res.send(phone);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

/**
 * Add/create methods
 */
exports.addCarrier = {
  'spec': {
    path: "/carrier",
    notes: "Adds a new carrier",
    summary: "Add a new carrier",
    method: "POST",
    parameters: [{
      // sw.pathParam("Carrier name", "JSON object representing the carrier to add", "Carrier")
      name: "Carrier name",
      description: "JSON object representing the carrier to add",
      required: true,
      type: "Carrier",
      paramType: "body"
    }],
    responseMessages: [swe.invalid('input')],
    nickname: "addCarrier"
  },
  'action': async (req, res) => {
    try {
      const carrier = await Carrier.model.create({name: req.body.name});
      res.send(carrier);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

exports.addManufacturer = {
  'spec': {
    path: "/manufacturer",
    notes: "Adds a new manufacturer",
    summary: "Add a new manufacturer",
    method: "POST",
    type: "Manufacturer",
    parameters: [{
      name: "Manufacturer",
      description: "JSON object representing the Manufacturer to add",
      required: true,
      type: "Manufacturer",
      paramType: "body"
    }],

    responseMessages: [swe.invalid('input')],
    nickname: "addManufacturer"
  },
  'action': async (req, res) => {
    try {
      const manufacturer = await Manufacturer.model.create({name: req.body.name});
      res.send(manufacturer);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

exports.addPhone = {
  'spec': {
    path: "/phone",
    notes: "Adds a new phone",
    summary: "Add a new phone",
    method: "POST",
    parameters: [{
      name: "Phone",
      description: "JSON object representing the Phone to add",
      required: true,
      type: "Phone",
      paramType: "body"
    }],
    responseMessages: [swe.invalid('input')],
    nickname: "addPhone"
  },
  'action': async (req, res) => {
    try {
      const phone = await Phone.model.create({name: req.body.name});
      res.send(phone);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

exports.addPhones = {
  spec: {
    path: "/phone/addList",
    notes: "Adds list of phones",
    summary: "Add list of phones",
    method: "POST",
    parameters: [{
      name: "Phones",
      description: "JSON object representing the Phones list to add",
      required: true,
      type: "Phone",
      paramType: "body"
    }],
    responseMessages: [swe.invalid('input')],
    nickname: "addPhones"
  },
  action: async (req, res) => {
    const body = req.body;
    const errMessage = 'Should be a list of Phones';
    try {
      if (Array.isArray(body) && body.length > 0) {
        if (body.filter(e => typeof e !== 'object' || Array.isArray(e)).length > 0) {
          throw new Error(errMessage);
        }
        try {
          const phones = await Phone.model.insertMany(body);
          res.send(phones);
        } catch (e) {
          res.status(400).send(e);
        }
      } else {
        throw new Error(errMessage);
      }
    } catch (err) {
      res.status(400).send({error: err.message});
    }
  }
};

/**
 * Update methods
 */
exports.updateCarrier = {
  'spec': {
    path: "/carrier/{id}",
    notes: "Update an existing carrier",
    summary: "Update an existing carrier",
    method: "PUT",
    //parameters : [sw.pathParam("Carrier ID", "Carrier ID to update", "Carrier"), sw.pathParam("Carrier name", "New carrier name", "Carrier")],
    parameters: [
      sw.pathParam("id", "Carrier ID to update", "string"),
      {
        name: "name",
        description: "New carrier name to use",
        required: true,
        type: "string",
        paramType: "body",
        produces: ["application/json", "string"],
      },
    ],
    responseMessages: [swe.invalid('input')],
    type: "string",
    nickname: "updateCarrier"
  },
  'action': async (req, res) => {
    try {
      const numRowsAffected = await Carrier.model.update({_id: req.params.id}, {name: req.body.name}, {runValidators: true});
      res.send(numRowsAffected);
    } catch (e) {
      res.status(500).send(e);
    }
  }
};

exports.updateManufacturer = {
  'spec': {
    path: "/manufacturer/{id}",
    notes: "Update an existing manufacturer",
    summary: "Update an existing manufacturer",
    method: "PUT",
    parameters: [
      sw.pathParam("id", "Manufacturer ID to update", "string"),
      {
        name: "name",
        description: "New manufacturer name to use",
        required: true,
        type: "string",
        paramType: "body"
      }
    ],
    responseMessages: [swe.invalid('input')],
    type: "Manufacturer",
    nickname: "updateManufacturer"
  },
  'action': async (req, res) => {
    try {
      const numRowsAffected =
        await Manufacturer.model.update({_id: req.params.id}, {name: req.body.name}, {runValidators: true});
      res.send(numRowsAffected);
    } catch (e) {
      res.status(500).send(e);
    }
  }
};

exports.updatePhone = {
  'spec': {
    path: "/phone/{id}",
    notes: "Update an existing phone",
    summary: "Update an existing phone",
    method: "PUT",
    parameters: [
      sw.pathParam("id", "Phone ID to update", "string"),
      {
        name: "name",
        description: "New Phone name to use",
        required: true,
        type: "string",
        paramType: "body"
      }
    ],
    responseMessages: [swe.invalid('input')],
    type: "Phone",
    nickname: "updatePhone"
  },
  'action': async (req, res) => {
    try {
      const numRowsAffected =
        await Phone.model.update({_id: req.params.id}, {name: req.body.name}, {runValidators: true});
      res.send(numRowsAffected);
    } catch (e) {
      res.status(500).send(e);
    }
  }
};

/**
 * Delete methods
 */
exports.deleteCarrier = {
  'spec': {
    path: "/carrier/{carrierId}",
    notes: "Delete an existing carrier",
    summary: "Delete an existing carrier",
    method: "DELETE",
    parameters: [sw.pathParam("carrierId", "Carrier ID to delete", "string")],
    responseMessages: [swe.invalid('input'), swe.notFound('carrier')],
    // type : "Carrier",
    nickname: "deleteCarrier"
  },
  'action': async (req, res) => {
    try {
      const result = await Carrier.model.remove({_id: req.params.carrierId});
      if(!result.n) {
        throw swe.notFound('carrier');
      }
      res.status(200).send({'msg': 'ok'});
    } catch (e) {
      res.status(e.code || 400).send(e)
    }
  }
};

exports.deleteManufacturer = {
  'spec': {
    path: "/manufacturer/{id}",
    notes: "Delete an existing manufacturer",
    summary: "Delete an existing manufacturer",
    method: "DELETE",
    parameters: [
      sw.pathParam("id", "Manufacturer ID to Manufacturer", "string"),
    ],
    responseMessages: [swe.invalid('input'), swe.notFound('manufacturer')],
    // type : "Manufacturer",
    nickname: "updateManufacturer"
  },
  'action': async (req, res) => {
    try {
      const result = await Manufacturer.model.remove({_id: req.params.id});
      if(!result.n) {
        throw swe.notFound('manufacturer');
      }
      res.status(200).send({'msg': 'ok'});
    } catch (e) {
      res.status(e.code || 400).send(e)
    }
  }
};

exports.deletePhone = {
  'spec': {
    path: "/phone/{id}",
    notes: "Delete an existing phone",
    summary: "Delete an existing phone",
    method: "DELETE",
    parameters: [
      sw.pathParam("id", "Phone ID to delete", "string")
    ],
    responseMessages: [swe.invalid('input'), swe.notFound('phone')],
    // type : "Phone",
    nickname: "deletePhone"
  },
  'action': async (req, res) => {
    try {
      const result = await Phone.model.remove({_id: req.params.id});
      if(!result.n) {
        throw swe.notFound('phone');
      }
      res.status(200).send({'msg': 'ok'});
    } catch (e) {
      res.status(e.code || 400).send(e)
    }
  }
};