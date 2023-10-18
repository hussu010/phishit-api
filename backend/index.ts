import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import morgan from "morgan";
import cors from "cors";
import { stream } from "./src/common/config/winston";

const app: Express = express();

app.enable("trust proxy");
app.use(cors());
app.use(
  morgan(
    // Standard Apache combined log output plus response time
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" - :response-time ms',
    { stream }
  )
);
app.use(express.json());

export default app;
