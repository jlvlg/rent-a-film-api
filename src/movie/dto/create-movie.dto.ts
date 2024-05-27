import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNumberString()
  price: number;

  @IsOptional()
  overview: string;

  @IsOptional()
  poster_path: string;

  @IsOptional()
  backdrop_path: string;

  @IsDateString()
  release_date: Date;
}
