import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PagedMovies } from './dto/paged-movies.enum';
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

  async getOneById(id: string, user: User) {
    const movie = await this.findOne({ where: { id } });
    const rating = await this.ratingRepo.findOneBy({ movie, user });
    await this.movieRepo.increment({ id }, 'views', 1);
    return { movie: movie, user_rating: rating?.rating };
  }

  getPaged(page: number, col: PagedMovies) {
    return this.movieRepo.find({
      order: { [col]: 'DESC' },
      skip: page * 20,
      take: 20,
    });
  }

  async findOne(options: FindOneOptions<Movie>, manager?: EntityManager) {
    const repo = manager?.withRepository(this.movieRepo) ?? this.movieRepo;
    const movie = await repo.findOne(options);
    if (!movie) throw new NotFoundException();
    return movie;
  }

  async find(options: FindManyOptions<Movie>, manager?: EntityManager) {
    const repo = manager?.withRepository(this.movieRepo) ?? this.movieRepo;
    return repo.find(options);
  }

  create(createMovieDto: CreateMovieDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.movieRepo);
      const movie = await repo.create(createMovieDto);
      return repo.save(movie);
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.withRepository(this.movieRepo);
      const movie = {
        ...(await this.findOne({ where: { id } }, manager)),
        ...updateMovieDto,
      };
      return repo.save(movie);
    });
  }

  async rate(id: string, rating: number, user: User) {
    if (rating < 0 || rating > 10)
      throw new BadRequestException('Rating must be a number between 0 and 10');

    return this.dataSource.transaction(async (manager) => {
      const ratingRepo = manager.withRepository(this.ratingRepo);
      const movieRepo = manager.withRepository(this.movieRepo);
      const movie = await this.findOne(
        { where: { id }, relations: { ratings: true } },
        manager,
      );
      const ratings = movie.ratings;
      const index = ratings.findIndex(
        (x) => x.movie.id === id && x.user.id === user.id,
      );
      if (index === -1) ratings.push(ratingRepo.create({ movie, user }));
      ratings[index === -1 ? ratings.length - 1 : index].rating = rating;
      movie.average_rating =
        ratings.reduce((a, b) => a + b.rating, 0) / ratings.length;
      return await movieRepo.save(movie);
    });
  }
}
