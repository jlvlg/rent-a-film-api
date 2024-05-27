import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ nullable: true })
  poster_path: string;

  @Column({ nullable: true })
  backdrop_path: string;

  @Column()
  release_date: Date;

  @Column()
  price: number;

  @Column({ default: 0 })
  @Exclude({ toPlainOnly: true })
  views: number;

  @Column({ default: 0 })
  average_rating: number;

  @OneToMany(() => Rating, (rating) => rating.movie, { cascade: true })
  @Exclude({ toPlainOnly: true })
  ratings: Rating[];
}
