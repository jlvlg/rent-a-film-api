import {
  Body,
  Controller,
  DefaultValuePipe,
  Inject,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  forwardRef,
} from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Action } from 'src/casl';
import { Order } from 'src/order/entities/order.entity';
import { OrderService } from 'src/order/order.service';
import {
  PolicyDelete,
  PolicyGet,
  PolicyPatch,
  PolicyPost,
} from 'src/policies-guard/access.decorator';
import { Policies } from 'src/policies-guard/policies.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { PagedMovies } from './dto/paged-movies.enum';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  @PolicyGet(Movie)
  getOneById(@Query('id') id: string, @GetUser() user: User) {
    return this.movieService.getOneById(id, user);
  }

  @PolicyGet(Movie, 'paged')
  getPaged(
    @Query('page', new DefaultValuePipe('0'), ParseIntPipe) page: number,
    @Query('col', new ParseEnumPipe(PagedMovies)) col: PagedMovies,
  ) {
    return this.movieService.getPaged(page, col);
  }

  @PolicyPost(Movie)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @PolicyPatch(Movie, ':id')
  @Policies((ability) => ability.can(Action.UPDATE, Movie))
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @PolicyPost(Rating, ':id/rate')
  rate(
    @Param('id') id: string,
    @Body('rating', ParseIntPipe) rating: number,
    @GetUser() user: User,
  ) {
    return this.movieService.rate(id, rating, user);
  }

  @PolicyGet(Order, 'can_watch')
  canWatchMovie(@Query('id') id: string, @GetUser() user: User) {
    return this.orderService.canWatchMovie(id, user);
  }

  @PolicyDelete(Movie, 'delete/:id')
  deleteMovie(@Param(':id') id: string) {
    this.movieService.deleteMovie(id);
  }
}
