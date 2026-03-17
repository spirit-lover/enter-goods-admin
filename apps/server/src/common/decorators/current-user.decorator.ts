import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserProfile } from '@enterprise/shared';

export const CurrentUser = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<{ user: UserProfile }>();
  return request.user;
});
