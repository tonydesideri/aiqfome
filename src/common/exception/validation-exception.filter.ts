import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { ValidationException } from './validation.exeption'

@Catch(ValidationException)
export class ValidationExceptionFilter
  implements ExceptionFilter<ValidationException>
{
  private readonly logger = new Logger()
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const { ip } = request
    const userAgent = request.get('user-agent') || ''

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse = {
      statusCode: status,
      message: exception.validationErrors,
      error: exception.message,
      fields: null,
    }

    this.logger.error(
      `${request.method} ${status} ${request.path} - ${userAgent} ${ip}`,
      'ValidationExceptionFilter'
    )

    return response.status(status).json(errorResponse)
  }
}
