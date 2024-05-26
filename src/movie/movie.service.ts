import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>,
    private readonly dataSource: DataSource,
  ) {}

  findOneBy(where: FindOptionsWhere<Movie>) {
    const movie = this.movieRepo.findOneBy(where);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  create(createMovieDto: CreateMovieDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.movieRepo);
      const movie = await repo.create(createMovieDto);
      return repo.save(movie);
    });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.movieRepo);
      const movie = { ...(await this.findOneBy({ id })), ...updateMovieDto };
      return repo.save(movie);
    });
  }

  rate(id: string, rating: number, user: User) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.ratingRepo);
      const movie = await this.findOneBy({ id });
      let instance = await repo.findOneBy({ movie, user });
      if (!instance) instance = await repo.create({ movie, user });
      instance.rating = rating;
      return await repo.save(instance);
    });
  }
}
