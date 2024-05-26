import { MongoAbility } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

export const Policies = (...handlers: ((ability: MongoAbility) => boolean)[]) =>
  SetMetadata('policies', handlers);
