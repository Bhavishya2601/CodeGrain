import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';

import codeRoutes from './routes/codeRoutes.js';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Backend Started');
});

app.use(cors());
app.use(bodyParser.json());

app.use('/code', codeRoutes);

app.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
