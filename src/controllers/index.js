import rulesRouter from "./rulesController/index.js";

const apiPrefix = "/api/v1";

const routes = [ rulesRouter ];

export default app => {
    routes.forEach( route => {
        app.use(apiPrefix, route);
    });

    return app;
}

