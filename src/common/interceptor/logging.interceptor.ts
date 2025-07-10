import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  Logger,
  type NestInterceptor,
} from '@nestjs/common'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const { ip, method, originalUrl, user } = request
    const userAgent = request.get('user-agent') || ''

    const { statusCode } = response
    const successStatusCodes = [
      200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
    ]

    if (successStatusCodes.includes(statusCode)) {
      const now = Date.now()
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `${method} ${statusCode} ${originalUrl} - [${
                user?.employee?.employee_code
              }] ${userAgent} ${ip} ${Date.now() - now}ms`,
              context.getClass().name
            )
          )
        )
    } else {
      return next.handle()
    }
  }
}
