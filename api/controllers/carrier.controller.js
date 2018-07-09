const sw = require('swagger-node-express'),
  swe = sw.errors;
const Carrier = require('../../models/carrier.model.js');

/**
 * getList
 * @type {{spec: {description: string, path: string, method: string, summary: string, notes: string, type: string,
 * nickname: string, produces: string[], parameters: Array, responseMessages: *[]}, action: action}}
 */
exports.getAllCarriers = {
  'spec': {
    description: "List all phone carriers",
    path: "/carrier/list",
    method: "GET",
    summary: "List all phone carriers",
    notes: "Returns a list of all phone carriers",
    type: "CarrierController",
    nickname: "getAllCarriers",
    produces: ["application/json"],
    parameters: [sw.headerParam("auth", "An authorization header", "string")],
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
    type: "CarrierController",
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

/**
 *
 * @type {{spec: {path: string, notes: string, summary: string, method: string, parameters: *[],
 * responseMessages: *[], nickname: string}, action: action}}
 */
exports.addCarrier = {
  'spec': {
    path: "/carrier",
    notes: "Adds a new carrier",
    summary: "Add a new carrier",
    method: "POST",
    parameters: [{
      // sw.pathParam("CarrierController name", "JSON object representing the carrier to add", "CarrierController")
      name: "CarrierController name",
      description: "JSON object representing the carrier to add",
      required: true,
      type: "CarrierController",
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

exports.updateCarrier = {
  'spec': {
    path: "/carrier/{id}",
    notes: "Update an existing carrier",
    summary: "Update an existing carrier",
    method: "PUT",
    //parameters : [sw.pathParam("CarrierController ID", "CarrierController ID to update", "CarrierController"), sw.pathParam("CarrierController name", "New carrier name", "CarrierController")],
    parameters: [
      sw.pathParam("id", "CarrierController ID to update", "string"),
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

exports.deleteCarrier = {
  'spec': {
    path: "/carrier/{carrierId}",
    notes: "Delete an existing carrier",
    summary: "Delete an existing carrier",
    method: "DELETE",
    parameters: [sw.pathParam("carrierId", "CarrierController ID to delete", "string")],
    responseMessages: [swe.invalid('input'), swe.notFound('carrier')],
    // type : "CarrierController",
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
