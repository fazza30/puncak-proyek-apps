import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

export const validateRequest =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid request",
          data: error.issues.map((e) => e.message),
        });
      }

      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  };