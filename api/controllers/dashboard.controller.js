const sw = require('swagger-node-express');
const swe = sw.errors;
const { applyPassport } = require('../../services/util.service');

/**
 *
 * @type {{spec: {description: string, path: string, method: string, summary: string, notes: string, type: string,
 * nickname: string, produces: string[], parameters: *[], responseMessages: *[]}, action: action}}
 */
exports.dashboard = {
  'spec': {
    description: "List all phone carriers",
    path: "/dashboard",
    method: "GET",
    summary: "Dashboard page",
    notes: "Returns all user data",
    type: "DashboardController",
    nickname: "dashboard",
    produces: ["application/json"],
    parameters: [sw.headerParam("authorization", "An authorization header", "string")],
    responseMessages: [swe.notFound('dashboard')]
  },
  'action': async (req, res, next) => {
    const user = req.user;
    try {
      res.send({ success: true, data: `User id: ${user.id}` });
    } catch (e) {
      res.status(404).send(e);
    }
  }
};
