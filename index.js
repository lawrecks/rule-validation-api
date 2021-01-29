import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

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


const server = app.listen(6000, () => {
    console.log(`Success!! app listening on port 6000`);
});

export default server;