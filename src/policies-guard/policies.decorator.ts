import { MongoAbility } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

export const POLICIES_KEY = 'policies';
export const Policies = (...handlers: ((ability: MongoAbility) => boolean)[]) =>
  SetMetadata(POLICIES_KEY, handlers);
