import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from "@nestjs/common";
import { Response } from "express";

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(404).json({
            status: "error",
            message: exception.message || "Route not found",
        });
    }
}
