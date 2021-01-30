import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./src/controllers/index.js";

const app = express();

const urlparser = express.urlencoded({
    extended : true,
});

const jsonParser = express.json();

app.use(urlparser);

app.use(jsonParser);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended : false,
}));

app.use(cors());

router(app);

const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Success!! app listening on port 8000`);
});

export default server;