import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    const { getResponse, getRequest } = host.switchToHttp()
    const response = getResponse()
    const request = getRequest()
    const isInstance = exception instanceof HttpException
    const status = (isInstance) ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = (isInstance) ? exception.getResponse() : exception

    this.logger.error(`Http Status: ${status} Error Message: ${JSON.stringify(message.message)}`)

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message
    })
  }
}