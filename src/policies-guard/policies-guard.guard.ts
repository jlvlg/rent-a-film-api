import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/public.decorator';
import defineUserAbilities from 'src/casl';
import { POLICIES_KEY } from './policies.decorator';
import { PolicyHandler } from './policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(POLICIES_KEY, context.getHandler()) ||
      [];
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()) || false;

    if (isPublic) return true;

    const { user } = context.switchToHttp().getRequest();
    const ability = defineUserAbilities(user);

    return policyHandlers.every((handler) => {
      if (typeof handler === 'function') return handler(ability);
      return handler.handle(ability);
    });
  }
}
