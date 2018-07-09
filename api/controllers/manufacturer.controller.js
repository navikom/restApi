const sw = require('swagger-node-express'),
  swe = sw.errors;
const Manufacturer = require('../../models/manufacturer.model.js');

exports.getAllManufacturers = {
  'spec': {
    description: "List all phone manufacturers",
    path: "/manufacturer/list",
    method: "GET",
    summary: "List all phone manufacturers",
    notes: "Returns a list of all phone manufacturers",
    type: "ManufacturerController",
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

exports.getManufacturerById = {
  'spec': {
    description: "Operations about manufacturers",
    path: "/manufacturer/{manufId}",
    method: "GET",
    summary: "Find manufacturer by ID",
    notes: "Returns a manufacturer based on ID",
    type: "ManufacturerController",
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

exports.addManufacturer = {
  'spec': {
    path: "/manufacturer",
    notes: "Adds a new manufacturer",
    summary: "Add a new manufacturer",
    method: "POST",
    type: "ManufacturerController",
    parameters: [{
      name: "ManufacturerController",
      description: "JSON object representing the ManufacturerController to add",
      required: true,
      type: "ManufacturerController",
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

exports.updateManufacturer = {
  'spec': {
    path: "/manufacturer/{id}",
    notes: "Update an existing manufacturer",
    summary: "Update an existing manufacturer",
    method: "PUT",
    parameters: [
      sw.pathParam("id", "ManufacturerController ID to update", "string"),
      {
        name: "name",
        description: "New manufacturer name to use",
        required: true,
        type: "string",
        paramType: "body"
      }
    ],
    responseMessages: [swe.invalid('input')],
    type: "ManufacturerController",
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

exports.deleteManufacturer = {
  'spec': {
    path: "/manufacturer/{id}",
    notes: "Delete an existing manufacturer",
    summary: "Delete an existing manufacturer",
    method: "DELETE",
    parameters: [
      sw.pathParam("id", "ManufacturerController ID to ManufacturerController", "string"),
    ],
    responseMessages: [swe.invalid('input'), swe.notFound('manufacturer')],
    // type : "ManufacturerController",
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