import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @ManyToOne(() => Movie, (movie) => movie.ratings, { eager: true })
  movie: Movie;

  @ManyToOne(() => User, (user) => user.ratings, { eager: true })
  user: User;
}
