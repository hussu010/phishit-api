import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("./src/common/config/db");
}

import morgan from "morgan";
import cors from "cors";
import timeout from "connect-timeout";
import { stream } from "./src/common/config/winston";

import {
  errorLogger,
  errorResponder,
  haltOnTimedout,
} from "./src/common/middlewares/errors";

import * as swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

import authRouter from "./src/auth/auth.route";
import healthRouter from "./src/common/routes/health.route";
import adventuresRouter from "./src/adventures/adventures.route";

const app: Express = express();

app.enable("trust proxy");
app.use(timeout("2.5s"));
app.use(cors());
app.use(
  morgan(
    // Standard Apache combined log output plus response time
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" - :response-time ms',
    { stream }
  )
);
app.use(express.json());
app.use(haltOnTimedout);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/adventures", adventuresRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorLogger);
app.use(errorResponder);

export default app;
