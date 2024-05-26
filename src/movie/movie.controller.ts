import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Action } from 'src/casl';
import { Policies } from 'src/policies-guard/policies.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @Policies((ability) => ability.can(Action.CREATE, Movie))
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(+id);
  }

  @Patch(':id')
  @Policies((ability) => ability.can(Action.UPDATE, Movie))
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @Policies((ability) => ability.can(Action.DELETE, Movie))
  remove(@Param('id') id: string) {
    return this.movieService.remove(+id);
  }

  // @Post(':id/rate')
  // @Policies((ability) => ability.can(Action.CREATE, Rating))
  // rate(@Param(':id') id: string) {
  //   return this.movieService.rate(+id);
  // }
}
