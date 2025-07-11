import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

export interface UserPayload {
  id: string
  email: string
}

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as UserPayload
  }
)
