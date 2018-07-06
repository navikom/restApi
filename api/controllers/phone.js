const sw = require('swagger-node-express'),
  swe = sw.errors;
const Phone = require('../../models/phone.js');

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