import { Movie } from 'src/movie/entities/movie.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { eager: true })
  movie: Movie;

  @ManyToOne(() => Order)
  order: Order;

  @Column()
  amount: number;
}
