import { Middleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware implements Middleware {
  public use(request: Request, response: Response, next: NextFunction) {
    try {
      if (process.env.NODE_ENV === "test") {
        response.locals.user = {
          id: 1,
          name: "Test",
        };
        return next();
      }
      const { token } = request.headers as { token: string };
      if (!token) throw new Error();

      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);

      response.locals.user = decoded as string;
      return next();
    } catch (error) {
      return response.status(401).send({ error: "You are not authenticated." });
    }
  }
}
