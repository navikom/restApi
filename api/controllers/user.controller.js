const sw = require('swagger-node-express');
const swe = sw.errors;
const authService = require('../../services/auth.service');
const User = require('../../models/user.model');
const Carrier = require('../../models/carrier.model');

const { to, errorResponse, successResponse } = require('../../services/util.service');

//{"phone": "88888888", "password":"123456"}
exports.create = {
  'spec': {
    path: "/users",
    notes: "Adds a new user",
    summary: "Add a new user",
    method: "POST",
    parameters: [{
      email: "UserController name",
      description: "JSON object representing the user to add",
      required: true,
      type: "UserController",
      paramType: "body",
    }],
    responseMessages: [swe.invalid('input')],
    nickname: "addCarrier"
  },
  'action': async function(req, res) {
    const body = req.body;
    res.setHeader('Content-Type', 'application/json');
    if (!body.email && !body.phone) {
      return errorResponse(res, 'Please enter an email or phone number to register.');
    } else if (!body.password) {
      return errorResponse(res, 'Please enter a password to register.');
    } else {
      let err, user;

      [err, user] = await to(authService.createUser(body));

      if (err) {
        return errorResponse(res, err, 422);
      }
      return successResponse(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
    }
  }
};

exports.get = async function(req, res) {
  let user = req.user;

  return successResponse(res, { user: user.toWeb() });
};

exports.getAllUsers = {
  'spec': {
    description: "List of users",
    path: "/users",
    method: "GET",
    summary: "List of users",
    notes: "Returns a list of users",
    type: "UserController",
    nickname: "getAllUsers",
    produces: ["application/json"],
    parameters: [],
    responseMessages: [swe.notFound('users')]
  },
  'action': async (req, res) => {
    try {
      const users = await User.model.find();
      res.send(users);
    } catch (e) {
      res.status(404).send(e);
    }
  }
};

exports.getUserById = {
  'spec': {
    description: "Operations about user",
    path: "/users/{id}",
    method: "GET",
    summary: "Find user by ID",
    notes: "Returns a user based on ID",
    type: "UserController",
    nickname: "getUserById",
    produces: ["application/json"],
    parameters: [sw.pathParam("id", "ID of the user to return", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('user')]
  },
  'action': async (req, res) => {
    try {
      const user = await User.model.findById(req.params.id).populate('carriers');
      // res.send(user);
      return successResponse(res, { user });
    } catch (e) {
      return errorResponse(res, e, 400);
    }
  }
};

exports.updateUser = {
  'spec': {
    path: "/users/{id}",
    notes: "Update an existing user",
    summary: "Update an existing user",
    method: "PUT",
    parameters: [
      sw.pathParam("id", "UserController ID to update", "string"),
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
  'action': async function(req, res)  {
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if (err) {
      console.log(err, user);

      if (err.message.includes('E11000')) {
        if (err.message.includes('phone')) {
          err = 'This phone number is already in use';
        } else if (err.message.includes('email')) {
          err = 'This email address is already in use';
        } else {
          err = 'Duplicate Key Entry';
        }
      }

      return errorResponse(res, err);
    }
    return successResponse(res, { message: 'Updated User: ' + user.email });
  }
};

exports.deleteUser = {
  'spec': {
    path: "/users/{id}",
    notes: "Delete user",
    summary: "Delete user",
    method: "DELETE",
    parameters: [
      sw.pathParam("id", "User ID to UserController", "string"),
    ],
    responseMessages: [swe.invalid('input'), swe.notFound('user')],
    nickname: "deleteUser"
  },
  'action': async function(req, res) {
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if (err) return errorResponse(res, 'error occured trying to delete user');

    return successResponse(res, { message: 'Deleted User' }, 204);
  }
};

exports.assignWithCarrier = {
  'spec': {
    path: "/users/{id}/carrier",
    notes: "Assign carrier with user",
    summary: "Assign carrier with user",
    method: "DELETE",
    parameters: [
      sw.pathParam("id", "User ID to UserController", "string"),
      {
        name: "carrierId",
        description: "Carrier id to bind with user",
        required: true,
        type: "string",
        paramType: "body",
        produces: ["application/json", "string"],
      },
    ],
    responseMessages: [swe.invalid('input'), swe.notFound('user')],
    nickname: "assignWithCarrier"
  },
  'action': async function(req, res) {
    try {
      const user = await User.model.findById(req.params.id);
      const carrier = await Carrier.model.findById(req.body.carrierId);
      carrier.user = user;
      await carrier.save();
      user.carriers.push(carrier);
      await user.save();
    } catch (e) {
      return errorResponse(res, e, 400);
    }

    return successResponse(res, { message: `Carrier ${req.body.carrierId} saved to user ${req.params.id}` }, 200);
  }
};

exports.login = {
  'spec': {
    path: "/users/login",
    notes: "Login user",
    summary: "Login user",
    method: "POST",
    parameters: [
      {
        email: "UserController name",
        description: "JSON object representing the user to login",
        required: true,
        type: "UserController",
        paramType: "body",
      },
    ],
    responseMessages: [swe.invalid('input')],
    type: "string",
    nickname: "updateCarrier"
  },
  'action': async function(req, res) {
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if (err) return errorResponse(res, err, 422);

    return successResponse(res, { token: user.getJWT(), user: user.toWeb() });
  }
};