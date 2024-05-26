import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
  create() {
    return 'This action adds a new movie';
  }

  findAll() {
    return `This action returns all movie`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
