import express, { Express, Request, Response , Application } from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const port = process.env.PORT;
 
app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200
}));
app.get('/', (req: Request, res: Response) => {
    console.log(req.query);
  res.send('Express server is up and running.');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


const search = require("./search-providers");
const suggest = require("./search-suggesters");

app.use("/search", search); 
app.use("/suggest", suggest); 