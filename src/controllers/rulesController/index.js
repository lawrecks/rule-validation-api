import express from "express";
import rulesController from "./rulesController.js"

const rulesRouter = express.Router();

rulesRouter.get('/', rulesController.index);

rulesRouter.post('/validate-rule', rulesController.validateRule);

export default rulesRouter;