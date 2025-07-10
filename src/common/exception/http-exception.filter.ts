import {
  type ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    const { ip } = request
    const userAgent = request.get('user-agent') || ''

    const status = this.getStatus(exception)
    const message = this.getMessage(exception)
    const error = this.getError(exception)
    const fields = this.getFields(exception)

    this.logError(
      request.method,
      status,
      request.path,
      userAgent,
      ip,
      exception
    )

    response.status(status).json({
      statusCode: status,
      message,
      error,
      fields,
    })
  }

  private getStatus(exception: any): HttpStatus {
    if (exception.name === 'PrismaClientKnownRequestError') {
      return this.getPrismaHttpStatus(exception)
    }
    if (exception instanceof HttpException) {
      return exception.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: any): string[] {
    if (exception.name === 'PrismaClientKnownRequestError') {
      return [this.getPrismaMessage(exception)]
    }
    if (exception instanceof HttpException) {
      return [exception.message]
    }
    return ['Internal server error.']
  }

  private getError(exception: any): string {
    if (exception.name === 'PrismaClientKnownRequestError') {
      return this.getPrismaError(exception)
    }
    if (exception instanceof HttpException) {
      return this.getHttpError(exception)
    }
    return 'Internal Server Error'
  }

  private getFields(exception: any): string | null {
    if (exception.name === 'PrismaClientKnownRequestError') {
      return this.getPrismaFieldName(exception)
    }
    return null
  }

  private logError(
    method: string,
    status: HttpStatus,
    path: string,
    userAgent: string,
    ip: string,
    exception: unknown
  ): void {
    const isError = status === HttpStatus.INTERNAL_SERVER_ERROR
    this.logger.error(`${method} ${status} ${path} - ${userAgent} ${ip}`)

    if (isError) {
      console.error(exception)
    }
  }

  private getPrismaMessage(exception: PrismaClientKnownRequestError): string {
    const messages: Record<string, string> = {
      P2000: 'The value provided for the field is too long.',
      P2002:
        'An entry with the same value already exists for the single field.',
      P2025: 'The requested resource was not found.',
    }
    return messages[exception.code] || 'Database internal server error.'
  }

  private getPrismaHttpStatus(
    exception: PrismaClientKnownRequestError
  ): HttpStatus {
    const statusMap: Record<string, HttpStatus> = {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }
    return statusMap[exception.code] || HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getPrismaError(exception: PrismaClientKnownRequestError): string {
    const errorMap: Record<string, string> = {
      P2000: new BadRequestException().message,
      P2002: new ConflictException().message,
      P2025: new NotFoundException().message,
    }
    return (
      errorMap[exception.code] || new InternalServerErrorException().message
    )
  }

  private getPrismaFieldName(
    exception: PrismaClientKnownRequestError
  ): string | null {
    return (exception.meta?.target as string) || null
  }

  private getHttpError(exception: HttpException): string {
    const response = exception.getResponse()

    if (typeof response === 'string') {
      return response
    }

    if (typeof response === 'object' && response !== null) {
      const errorResponse = response as { error?: string; message?: string }

      // Se o status for 500 (Internal Server Error), priorize a mensagem.
      if (exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR) {
        return errorResponse.message || 'Internal Server Error'
      }

      // Caso contrário, priorize o erro.
      return errorResponse.error || 'Error'
    }

    return 'Unknown error'
  }
}
