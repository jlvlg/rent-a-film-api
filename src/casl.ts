import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  createMongoAbility,
} from '@casl/ability';
import { User } from 'src/auth/entities/user.entity';
import { Rating } from './movie/entities/rating.entity';
import { Order } from './order/entities/order.entity';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

const Subjects = [User, Rating];
type SubjectsType = InferSubjects<(typeof Subjects)[number]> | 'all';

export default function defineUserAbilities(user: User) {
  const abilityBuilder = new AbilityBuilder(createMongoAbility);
  const { can, build } = abilityBuilder;

  if (user.isAdmin) {
    can(Action.MANAGE, 'all');
  } else {
    can(Action.READ, 'all');
  }

  can(Action.CREATE, Rating);
  can(Action.CREATE, Order);

  return build({
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<SubjectsType>,
  });
}
