import "reflect-metadata";
import express, { Router } from "express";
import * as dotenv from "dotenv";
import UserController from "./controller/UserController";
import TaskController from "./controller/TaskController";
import { attachControllers } from "@decorators/express";
dotenv.config();

const app = express();

const router = Router();

app.use(express.json());
attachControllers(router, [UserController, TaskController]);
app.use(router);

export { app };
