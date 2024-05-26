import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  overview: string;

  @Column()
  release_date: Date;

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];
}
