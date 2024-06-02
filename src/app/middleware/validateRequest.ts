import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

const validateRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.errors
          ? err.errors.map((e: any) => e.message).join(", ")
          : "Invalid request",
      });
    }
  };

export default validateRequest;
