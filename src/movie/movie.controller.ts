import { Body, Controller, Param, ParseIntPipe } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Action } from 'src/casl';
import { PolicyPatch, PolicyPost } from 'src/policies-guard/access.decorator';
import { Policies } from 'src/policies-guard/policies.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @PolicyPost(Movie)
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @PolicyPatch(Movie, ':id')
  @Policies((ability) => ability.can(Action.UPDATE, Movie))
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @PolicyPost(Movie, ':id/rate')
  @Policies((ability) => ability.can(Action.CREATE, Rating))
  rate(
    @Param(':id') id: string,
    @Body('rating', ParseIntPipe) rating: number,
    @GetUser() user: User,
  ) {
    return this.movieService.rate(id, rating, user);
  }
}
