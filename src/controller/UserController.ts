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
import UserRepository from "../repository/UserRepository";
import { IUser } from "../interfaces";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

@Controller("/users")
export default class UserController {
  private userRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  @Get("/", [AuthMiddleware])
  async getAll(@Response() res: express.Response, @Query() queryString: any) {
    const users = await this.userRepository.getAll(queryString);
    res.json(users);
  }

  @Get("/:id", [AuthMiddleware])
  async getById(@Response() res: express.Response, @Params("id") id: number) {
    const result = await this.userRepository.getById(id);
    return res.json(result);
  }

  @Post("/", [AuthMiddleware])
  async create(@Body() body: IUser, @Response() res: express.Response) {
    const result = await this.userRepository.create(body);
    return res.send(result);
  }

  @Put("/:id", [AuthMiddleware])
  async update(
    @Body() body: IUser,
    @Response() res: express.Response,
    @Params("id") id: number
  ) {
    const result = await this.userRepository.update(body, id);
    return res.send(result);
  }

  @Delete("/:id", [AuthMiddleware])
  async delete(@Response() res: express.Response, @Params("id") id: number) {
    const result = await this.userRepository.delete(id);
    return res.send(result);
  }

  @Post("/login")
  async login(
    @Response() res: express.Response,
    @Body("email") email: string,
    @Body("password") password: string
  ) {
    const user = await this.userRepository.login(email, password);
    if (!user)
      res.json({
        error: "Could not find user with this email and/or password",
      });

    const { id, name } = user!;

    const payload = { id, email, name };
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, {
      expiresIn: 60 * 60 * 24,
    });

    return res.json({ id, name, token });
  }
}
