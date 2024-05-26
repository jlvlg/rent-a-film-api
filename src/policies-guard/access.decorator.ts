import { Subject } from '@casl/ability';
import { Delete, Get, Patch, Post, applyDecorators } from '@nestjs/common';
import { Action } from 'src/casl';
import { Policies } from './policies.decorator';

export function PolicyGet(subject: Subject, path?: string | string[]) {
  return applyDecorators(
    Get(path),
    Policies((ability) => ability.can(Action.READ, subject)),
  );
}
export function PolicyPost(subject: Subject, path?: string | string[]) {
  return applyDecorators(
    Post(path),
    Policies((ability) => ability.can(Action.CREATE, subject)),
  );
}
export function PolicyPatch(subject: Subject, path?: string | string[]) {
  return applyDecorators(
    Patch(path),
    Policies((ability) => ability.can(Action.UPDATE, subject)),
  );
}
export function PolicyDelete(subject: Subject, path?: string | string[]) {
  return applyDecorators(
    Delete(path),
    Policies((ability) => ability.can(Action.DELETE, subject)),
  );
}
