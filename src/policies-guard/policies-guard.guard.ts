import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import defineUserAbilities from 'src/casl';
import { PolicyHandler } from './policy-handler.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>('policies', context.getHandler()) ||
      [];

    const { user } = context.switchToHttp().getRequest();
    const ability = defineUserAbilities(user);

    return policyHandlers.every((handler) => {
      if (typeof handler === 'function') return handler(ability);
      return handler.handle(ability);
    });
  }
}
