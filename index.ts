import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("./src/common/config/db-connect");
}

import morgan from "morgan";
import cors from "cors";
import { stream } from "./src/common/config/winston";

import { errorLogger, errorResponder } from "./src/common/middlewares/errors";

import authRouter from "./src/auth/auth.route";

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

app.use("/api/auth", authRouter);

app.use(errorLogger);
app.use(errorResponder);

export default app;
