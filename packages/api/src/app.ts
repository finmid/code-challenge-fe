import express from 'express';
import cors from 'cors';
import { serve, setup } from 'swagger-ui-express';
import yaml from 'yamljs';
import { errorHandler, tokenParserMiddleware } from './middleware';
import { AuthController } from './controllers';
import { UsersController, SmesController } from 'src/controllers';
import path from 'path';
import { TransactionsController } from './controllers/TransactionsController';
import { PORT } from './constants';
import {schema} from "src/graphql";
import {createYoga} from 'graphql-yoga'

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

// setup the swagger docs
const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
app.use('/docs', serve, setup(swaggerDocument));

app.post('/login', AuthController.login);
app.get('/users', tokenParserMiddleware, UsersController.getUsers);
app.get('/sme-data', tokenParserMiddleware, SmesController.getSme);
app.get(
  '/transactions',
  tokenParserMiddleware,
  TransactionsController.getTransactions
);

// GraphQL
const yoga = createYoga({schema})
app.use(yoga.graphqlEndpoint, yoga)

app.use(errorHandler);
console.log('\n 🚀\x1b[33m finmid\x1b[90m mock API online\x1b[93m :) \x1b[0m');
console.log(
  `\n\t\x1b[33m ➜\x1b[37m Running on\x1b[33m \t\thttp://localhost:${PORT}\x1b[0m`
);
console.log(
  `\t\x1b[33m ➜\x1b[90m Documentation at\x1b[33m \thttp://localhost:${PORT}/docs\x1b[0m\n`
);
app.listen(PORT);
