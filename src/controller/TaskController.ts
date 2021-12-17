import {
  Response,
  Params,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
} from "@decorators/express";
import * as express from "express";
import TaskRepository from "../repository/TaskRepository";
import { ITask } from "../interfaces";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import * as Yup from "yup";

@Controller("/tasks", [AuthMiddleware])
export default class TaskController {
  private taskRepository;
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  @Get("/")
  async getAll(@Response() res: express.Response, @Query() queryString: any) {
    const { user } = res.locals;
    const tasks = await this.taskRepository.getAll(user.id!, queryString);
    res.json(tasks);
  }

  @Get("/:id")
  async getById(@Response() res: express.Response, @Params("id") id: number) {
    const { user } = res.locals;
    const result = await this.taskRepository.getById(user.id, id);
    return res.json(result);
  }

  @Post("/")
  async create(@Body() body: ITask, @Response() res: express.Response) {
    await this.validateData(body);
    const { user } = res.locals;
    const result = await this.taskRepository.create(user.id, body);
    return res.send(result);
  }

  @Put("/:id")
  async update(
    @Body() body: ITask,
    @Response() res: express.Response,
    @Params("id") id: number
  ) {
    await this.validateData(body);

    const { user } = res.locals;
    const result = await this.taskRepository.update(user.id, body, id);
    return res.send(result);
  }

  @Put("/:id/status")
  async changeStatus(
    @Body("status") status: string,
    @Response() res: express.Response,
    @Params("id") id: number
  ) {
    const { user } = res.locals;
    const result = await this.taskRepository.changeStatus(user.id, id, status);
    return res.send(result);
  }

  @Delete("/:id")
  async delete(@Response() res: express.Response, @Params("id") id: number) {
    const { user } = res.locals;
    const result = await this.taskRepository.delete(user.id, id);
    return res.send(result);
  }

  private async validateData(body: ITask) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      status: Yup.string().required(),
    });
    try {
      await schema.validate(body, { abortEarly: false });
    } catch (error) {
      throw error;
    }
  }
}
