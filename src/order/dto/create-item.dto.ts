import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  movie_id: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
